
# 🔒 Pipeline CI/CD Seguro con ML - Secure DevOps

## Universidad de las Fuerzas Armadas ESPE
### Desarrollo de Software Seguro

---

## 📋 Descripción del Proyecto

Pipeline CI/CD completamente automatizado que integra un **modelo de Inteligencia Artificial basado en técnicas de minería de datos** para clasificar código fuente como seguro o vulnerable. Implementa los principios de **Secure DevOps** y **Shift-Left Security**, garantizando que únicamente código seguro llegue a producción.

## 🎯 Objetivo

Crear una infraestructura CI/CD que procese automáticamente código fuente mediante un modelo de ML (scikit-learn) entrenado para detectar vulnerabilidades, rechazando PRs con código inseguro antes de que lleguen a producción.

---

## 🤖 Modelo de Machine Learning

### Características del Modelo

- **Tipo:** Clasificador de Minería de Datos Tradicional (GradientBoosting)
- **Framework:** scikit-learn
- **Archivo del modelo:** `model/modelo_vulnerabilidades.pkl`
- **Vectorización:** TF-IDF para extracción de features del código

### Métricas de Rendimiento

```
⚠️ IMPORTANTE: Documentar aquí las métricas reales del modelo entrenado
Accuracy: [PENDIENTE - debe ser >= 82%]
Precision: [PENDIENTE]
Recall: [PENDIENTE]
F1-Score: [PENDIENTE]
```

### Features Extraídas

El modelo analiza el código fuente extrayendo las siguientes características:

1. **Tokens del código:** Vectorización TF-IDF del código limpio
2. **Limpieza de código:** Remoción de comentarios y normalización
3. **Patrones de vulnerabilidad:** Detección de:
   - Llamadas a funciones peligrosas (`eval`, `exec`, `subprocess`)
   - Consultas SQL sin parametrizar
   - Uso de `innerHTML`, `dangerouslySetInnerHTML`
   - Falta de sanitización de entradas
   - Deserialización insegura

### Dataset Utilizado

```
⚠️ PENDIENTE: Documentar el dataset usado
Dataset: [Nombre del dataset - kaggle/Big-Vul/DiverseVul/CVEFixes/Juliet]
Tamaño: [Número de muestras]
Split: [Train/Val/Test]
```

---

## 🔄 Flujo del Pipeline CI/CD

### Ramas del Repositorio

```
dev  → Rama de desarrollo (desarrolladores hacen push aquí)
test → Rama de staging/pruebas
main → Rama de producción (código deployado)
```

### Trigger

El pipeline se activa automáticamente al **crear un Pull Request de `dev` → `test`**

### Etapas del Pipeline

#### ✅ Etapa 1: Revisión de Seguridad con Modelo ML

**Workflow:** `.github/workflows/security_check.yml`

1. Se descarga el diff del PR
2. El modelo de ML clasifica el código modificado
3. **Si VULNERABLE:**
   - ❌ PR se rechaza automáticamente
   - 📝 Comentario detallado en PR con tipo de vulnerabilidad y probabilidad
   - 🚨 Issue automática creada con etiqueta `vulnerability`
   - 📱 Notificación Telegram inmediata al equipo
4. **Si SEGURO:**
   - ✅ PR aprobado para continuar
   - ➡️ Pipeline continúa a Etapa 2

**Notificaciones Telegram:**
- Inicio de revisión de seguridad
- Resultado de clasificación (con probabilidad)
- Rechazo por vulnerabilidad (con detalles)

#### ✅ Etapa 2: Merge Automático + Pruebas

**Workflow:** `.github/workflows/merge-and-test.yml`

1. Merge automático a rama `test`
2. Ejecución de pruebas unitarias (Jest para frontend)
3. **Si pruebas fallan:**
   - ❌ Bloqueo del proceso
   - 📱 Notificación Telegram
   - 🏷️ Etiqueta `tests-failed`
4. **Si pruebas pasan:**
   - ✅ Merge confirmado
   - ➡️ Pipeline continúa a Etapa 3

**Notificaciones Telegram:**
- Merge a test realizado
- Resultado de pruebas

#### ✅ Etapa 3: Merge a Main + Despliegue a Producción

**Workflows:** 
- `.github/workflows/promote-to-main.yml`
- `.github/workflows/deploy-to-production.yml`

1. Merge automático de `test` → `main`
2. Creación de tag de release automático
3. Build de imagen Docker
4. Despliegue automático a **Vercel**
5. Notificación de deploy exitoso/fallido

**Notificaciones Telegram:**
- Promoción a main completada
- Despliegue en producción exitoso/fallido

---

## 🔧 Configuración del Proyecto

### Requisitos Previos

- Python 3.10+
- Node.js 18+
- Git
- Cuenta de GitHub
- Bot de Telegram configurado
- Cuenta de Vercel

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/kechavez07/Proyecto_Segundo_SF.git
cd Proyecto_Segundo_SF

# Instalar dependencias de Python
pip install -r requirements.txt

# Instalar dependencias del frontend
cd proyect
npm install
```

### Configuración de Secrets en GitHub

Ve a `Settings` → `Secrets and variables` → `Actions` y agrega:

```
TELEGRAM_TOKEN=<tu-bot-token>
TELEGRAM_CHAT_ID=<tu-chat-id>
VERCEL_TOKEN=<tu-vercel-token>
VERCEL_ORG_ID=<tu-org-id>
VERCEL_PROJECT_ID=<tu-project-id>
```

### Branch Protection Rules

**Configuración obligatoria en GitHub:**

#### Rama `test`:
1. Settings → Branches → Add branch protection rule
2. Branch name pattern: `test`
3. ✅ Require status checks to pass before merging
4. ✅ Require `security-check` to pass
5. ✅ Require `run-tests` to pass
6. ❌ No requerir approvals (para permitir auto-merge)

#### Rama `main`:
1. Branch name pattern: `main`
2. ✅ Require status checks to pass before merging
3. ✅ Permitir solo merge desde `test`

---

## 📱 Configuración de Telegram Bot

### Crear Bot

1. Habla con [@BotFather](https://t.me/botfather)
2. Envía `/newbot` y sigue instrucciones
3. Copia el token generado
4. Obtén el Chat ID:
   ```bash
   curl https://api.telegram.org/bot<TOKEN>/getUpdates
   ```

---

## 🚀 Uso del Pipeline

### Flujo de Trabajo para Desarrolladores

```bash
# 1. Trabajar en rama dev
git checkout dev
git pull origin dev

# 2. Hacer cambios
# [editar código]

# 3. Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin dev

# 4. Crear Pull Request en GitHub
# dev → test

# 5. El pipeline se ejecuta automáticamente
# - Revisión de seguridad con ML
# - Tests automáticos
# - Deploy automático (si todo pasa)
```

### Ejemplo de Código Vulnerable Detectado

El modelo detectará patrones como:

```javascript
// ❌ VULNERABLE - XSS
element.innerHTML = userInput;

// ❌ VULNERABLE - SQL Injection
query = "SELECT * FROM users WHERE id=" + userId;

// ❌ VULNERABLE - Command Injection
exec(userCommand);
```

---

## 📊 Estructura del Proyecto

```
.
├── .github/
│   └── workflows/
│       ├── security_check.yml      # Etapa 1: Análisis de seguridad
│       ├── merge-and-test.yml      # Etapa 2: Tests y merge
│       ├── promote-to-main.yml     # Promoción a main
│       └── deploy-to-production.yml # Etapa 3: Deploy
├── model/
│   └── modelo_vulnerabilidades.pkl # Modelo ML entrenado
├── proyect/                        # Aplicación React
│   ├── src/
│   ├── package.json
│   └── jest.config.ts
├── git_scan_commits.py             # Script de análisis de código
├── requirements.txt                # Dependencias Python
├── Dockerfile                      # Containerización
└── README.md                       # Este archivo
```

---

## 🎓 Autores

- **Pamela Chipe**
- **Kleber Chavez**
- **Gabriel Reinoso**

**Universidad de las Fuerzas Armadas ESPE**  
Desarrollo de Software Seguro - 2025

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para la asignatura de Desarrollo de Software Seguro.

---

## ⚠️ Notas Importantes

1. **NO se utilizan LLMs:** El modelo es un clasificador tradicional de scikit-learn
2. **Accuracy mínima:** Debe demostrar >= 82% en validación cruzada
3. **Despliegue real:** La aplicación debe estar online y accesible
4. **Branch protection:** Configuración obligatoria en GitHub
5. **Notificaciones:** Telegram configurado para todas las etapas 

### Licencia

[Especificar licencia]
