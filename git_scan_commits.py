#!/usr/bin/env python3
"""
git_scan_commits.py - Escanea archivos modificados en commits usando el modelo de vulnerabilidades

Uso:
    python git_scan_commits.py                    # Escanea el último commit
    python git_scan_commits.py --commits 5        # Escanea los últimos 5 commits
    python git_scan_commits.py --branch develop   # Escanea commits en rama develop vs main
    python git_scan_commits.py --all              # Escanea todos los commits

Salida:
    - exit code 0 => no vulnerabilidades detectadas
    - exit code 1 => vulnerabilidades encontradas
    - Genera result.json con detalles
"""

import sys
import os
import re
import json
import pickle
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple
import argparse

# === CONFIGURACIÓN ===
MODEL_FILE = "model/modelo_vulnerabilidades.pkl"
VALID_EXTENSIONS = ('.c', '.cpp', '.h', '.hpp', '.py', '.java', '.js', '.php', '.rb', '.ts', '.go')
VULN_THRESHOLD = float(os.environ.get("VULN_THRESHOLD", "0.5"))
SCAN_LOCAL_FILES = os.environ.get("SCAN_LOCAL_FILES", "true").lower() == "true"
ANALYZE_DIR = "proyect"  # Directorio a analizar localmente

def clean_code(text):
    """Limpieza para TF-IDF - DEBE SER IDÉNTICA AL ENTRENAMIENTO"""
    if not isinstance(text, str):
        return ""
    text = re.sub(r'//.*', '', text)
    text = re.sub(r'#.*', '', text)
    text = re.sub(r'/\*[\s\S]*?\*/', '', text)
    text = re.sub(r'"""[\s\S]*?"""', '', text)
    text = re.sub(r"'''[\s\S]*?'''", '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.lower()

def load_model():
    """Carga el modelo entrenado"""
    if not os.path.exists(MODEL_FILE):
        print(f"[ERROR] No se encuentra: {MODEL_FILE}")
        print("Ejecuta primero: python 3_improved_ai_pipeline_NO_XGBOOST.py")
        sys.exit(1)
    
    with open(MODEL_FILE, "rb") as f:
        model_data = pickle.load(f)
    
    return {
        'vectorizer': model_data['vectorizer'],
        'model': model_data['gb_model'],
        'patterns': model_data['vulnerability_patterns'],
        'classes': model_data['classes']
    }

def get_changed_files(commits: int = 1, branch: str = None) -> List[Tuple[str, str, str]]:
    """
    Obtiene archivos modificados en los commits
    
    Returns:
        List of (commit_hash, file_path, change_type) tuples
    """
    try:
        if branch:
            # Comparar rama con main
            cmd = f"git diff main..{branch} --name-status"
        elif commits == 0:
            # Todos los commits
            cmd = "git log --name-status --pretty=format:%H"
        else:
            # Últimos N commits
            cmd = f"git log -n {commits} --name-status --pretty=format:%H"
        
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"[ERROR] Error ejecutando git: {result.stderr}")
            return []
        
        changed_files = []
        lines = result.stdout.strip().split('\n')
        current_hash = None
        
        for line in lines:
            if len(line) == 40 and all(c in '0123456789abcdef' for c in line):
                # Es un hash de commit
                current_hash = line
            elif line and current_hash:
                # Es un archivo modificado (formato: TYPE\tFILE)
                parts = line.split('\t')
                if len(parts) == 2:
                    change_type, file_path = parts
                    changed_files.append((current_hash, file_path, change_type))
        
        return changed_files
    
    except Exception as e:
        print(f"[ERROR] Error obteniendo archivos modificados: {e}")
        return []

def get_file_content(commit_hash: str, file_path: str) -> str:
    """Obtiene el contenido de un archivo en un commit específico"""
    try:
        cmd = f"git show {commit_hash}:{file_path}"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            return result.stdout
        else:
            # El archivo no existe en ese commit (puede ser eliminado)
            return None
    
    except Exception as e:
        print(f"[ERROR] Error obteniendo contenido de {file_path}: {e}")
        return None

def get_local_files(directory: str = "proyect") -> List[str]:
    """Obtiene lista de archivos locales con extensiones válidas"""
    local_files = []
    try:
        for root, dirs, files in os.walk(directory):
            # Ignorar node_modules y otros directorios comunes
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__', '.venv', 'venv']]
            
            for file in files:
                if any(file.endswith(ext) for ext in VALID_EXTENSIONS):
                    full_path = os.path.join(root, file)
                    local_files.append(full_path)
    except Exception as e:
        print(f"[ERROR] Error al escanear directorio {directory}: {e}")
    
    return local_files

def read_local_file(file_path: str) -> str:
    """Lee contenido de un archivo local"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    except Exception as e:
        print(f"[ERROR] Error al leer {file_path}: {e}")
        return None

def analyze_file(filepath: str, code: str, model_data: dict) -> Dict:
    """Analiza un archivo para detectar vulnerabilidades"""
    try:
        vectorizer = model_data['vectorizer']
        model = model_data['model']
        classes = model_data['classes']
        
        # Vectorizar
        X = vectorizer.transform([code])
        
        # Predicción
        prediction = model.predict(X)[0]
        
        # Probabilidades
        probabilities = model.predict_proba(X)[0]
        confidence = max(probabilities) * 100
        
        # Obtener todas las probabilidades
        all_probs = {}
        for idx, class_name in enumerate(classes):
            all_probs[class_name] = float(probabilities[idx] * 100)
        
        # Ordenar por probabilidad
        sorted_probs = sorted(all_probs.items(), key=lambda x: x[1], reverse=True)
        
        return {
            'file': filepath,
            'prediction': prediction,
            'confidence': float(confidence),
            'is_vulnerable': confidence >= VULN_THRESHOLD,
            'top_predictions': [
                {'class': name, 'confidence': conf}
                for name, conf in sorted_probs[:3]
            ],
            'code_length': len(code)
        }
    
    except Exception as e:
        return {
            'file': filepath,
            'error': str(e),
            'is_vulnerable': False
        }

def get_commit_info(commit_hash: str) -> Dict:
    """Obtiene información del commit"""
    try:
        cmd = f"git log -1 --pretty=format:%H|%an|%ae|%ai|%s {commit_hash}"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            parts = result.stdout.split('|')
            return {
                'hash': parts[0][:8],  # Abreviar hash
                'author': parts[1] if len(parts) > 1 else 'Unknown',
                'email': parts[2] if len(parts) > 2 else 'Unknown',
                'date': parts[3] if len(parts) > 3 else 'Unknown',
                'message': parts[4] if len(parts) > 4 else 'Unknown'
            }
    except:
        pass
    
    return {'hash': commit_hash[:8], 'author': 'Unknown', 'message': 'Unknown'}

def main():
    parser = argparse.ArgumentParser(
        description='Escanea archivos modificados en commits usando modelo de vulnerabilidades'
    )
    parser.add_argument('--commits', type=int, default=1, 
                       help='Número de commits a escanear (default: 1)')
    parser.add_argument('--branch', type=str, default=None,
                       help='Rama a comparar con main (default: None)')
    parser.add_argument('--all', action='store_true',
                       help='Escanea todos los commits')
    parser.add_argument('--local', action='store_true',
                       help='Escanea también archivos locales en proyect/')
    parser.add_argument('--output', type=str, default='result.json',
                       help='Archivo de salida JSON (default: result.json)')
    
    args = parser.parse_args()
    
    
    commits_to_scan = 0 if args.all else args.commits
    
    print("[*] Cargando modelo entrenado...")
    model_data = load_model()
    print("    ✓ Modelo cargado exitosamente.\n")
    
    all_results = []
    any_vulnerable = False
    total_files_analyzed = 0
    
    # ===== ESCANEAR ARCHIVOS LOCALES =====
    if args.local or SCAN_LOCAL_FILES:
        print("[*] Escaneando archivos locales en proyect/...")
        local_files = get_local_files(ANALYZE_DIR)
        
        if local_files:
            local_results = {
                'commit': {
                    'hash': 'LOCAL',
                    'author': 'Local Scan',
                    'message': f'Análisis de {len(local_files)} archivos locales'
                },
                'files': []
            }
            
            for file_path in local_files:
                # Obtener contenido
                code = read_local_file(file_path)
                
                if code is None:
                    continue
                
                print(f"    - Analizando: {file_path}")
                
                # Limpiar ruta para que sea relativa
                display_path = file_path.replace('\\', '/')
                
                # Analizar
                result = analyze_file(display_path, code, model_data)
                result['status'] = 'MODIFIED'
                
                local_results['files'].append(result)
                total_files_analyzed += 1
                
                if result.get('is_vulnerable', False):
                    any_vulnerable = True
                    print(f"      ⚠️  VULNERABLE: {result['prediction']} ({result['confidence']:.1f}%)")
            
            if local_results['files']:
                all_results.append(local_results)
                print(f"    ✓ {len(local_files)} archivos locales analizados.\n")
    
    # ===== ESCANEAR COMMITS =====
    print("[*] Obteniendo archivos modificados en commits...")
    changed_files = get_changed_files(commits_to_scan, args.branch)
    
    if not changed_files:
        if not args.local and not SCAN_LOCAL_FILES:
            print("[!] No se encontraron archivos modificados en commits.")
    else:
        print(f"    ✓ {len(changed_files)} cambios encontrados en commits.\n")
        
        # Agrupar por commit
        commits_data = {}
        for commit_hash, file_path, change_type in changed_files:
            if commit_hash not in commits_data:
                commits_data[commit_hash] = {
                    'info': get_commit_info(commit_hash),
                    'files': []
                }
            commits_data[commit_hash]['files'].append((file_path, change_type))
        
        # Analizar archivos de commits
        for commit_hash, commit_info in commits_data.items():
            print(f"[*] Analizando commit {commit_info['info']['hash']}: {commit_info['info']['message']}")
            
            commit_results = {
                'commit': commit_info['info'],
                'files': []
            }
            
            for file_path, change_type in commit_info['files']:
                # Filtrar por extensión
                if not any(file_path.endswith(ext) for ext in VALID_EXTENSIONS):
                    continue
                
                print(f"    - Analizando: {file_path}")
                
                # Obtener contenido del archivo
                code = get_file_content(commit_hash, file_path)
                
                if code is None:
                    # Archivo eliminado
                    commit_results['files'].append({
                        'file': file_path,
                        'status': 'deleted',
                        'is_vulnerable': False
                    })
                    continue
                
                # Analizar
                result = analyze_file(file_path, code, model_data)
                result['status'] = change_type
                
                commit_results['files'].append(result)
                total_files_analyzed += 1
                
                if result.get('is_vulnerable', False):
                    any_vulnerable = True
                    print(f"      ⚠️  VULNERABLE: {result['prediction']} ({result['confidence']:.1f}%)")
            
            if commit_results['files']:
                all_results.append(commit_results)
    
    
    # Generar salida
    output = {
        'summary': {
            'commits_scanned': len(all_results),
            'files_analyzed': total_files_analyzed,
            'vulnerable_found': any_vulnerable,
            'threshold': VULN_THRESHOLD
        },
        'commits': all_results
    }
    
    # Guardar JSON
    with open(args.output, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n{'='*70}")
    print(" RESUMEN")
    print(f"{'='*70}")
    print(f"Fuentes escaneadas:    {output['summary']['commits_scanned']}")
    print(f"Archivos analizados:   {output['summary']['files_analyzed']}")
    print(f"Vulnerabilidades:      {output['summary']['vulnerable_found']}")
    print(f"Umbral de detección:   {VULN_THRESHOLD}")
    print(f"Resultado guardado:    {args.output}")
    print(f"{'='*70}\n")
    
    if any_vulnerable:
        print("⚠️  VULNERABILIDADES DETECTADAS")
        sys.exit(1)
    else:
        print("✓ No se detectaron vulnerabilidades.")
        sys.exit(0)

if __name__ == "__main__":
    main()