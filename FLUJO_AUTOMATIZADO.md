# 🔄 Flujo CI/CD Automatizado - Diagrama Completo

## Resumen del Flujo Automático

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUJO TOTALMENTE AUTOMATIZADO                     │
└─────────────────────────────────────────────────────────────────────┘

1️⃣  PUSH a dev
    │
    ├─► 🔍 Workflow: security-check.yml se activa automáticamente
    │   │
    │   ├─► 📱 Telegram: "Iniciando revisión de seguridad"
    │   ├─► 🤖 Modelo ML analiza el código
    │   ├─► 📊 Clasifica: SEGURO o VULNERABLE
    │   │
    │   ├─► Si VULNERABLE:
    │   │   ├─► ❌ Detiene el proceso
    │   │   ├─► 🚨 Crea Issue en GitHub
    │   │   └─► 📱 Telegram: "Código vulnerable detectado + detalles"
    │   │
    │   └─► Si SEGURO:
    │       ├─► ✅ Código aprobado
    │       ├─► 📱 Telegram: "Resultado: CÓDIGO SEGURO (detalles)"
    │       └─► 🔄 Crea PR automático: dev → test
    │
    └─► 📝 PR #X creado: dev → test
        └─► 📱 Telegram: "PR creado automáticamente #X"

2️⃣  PR a test (creado automáticamente)
    │
    ├─► 🧪 Workflow: merge-and-test.yml se activa
    │   │
    │   ├─► 🔬 Ejecuta pruebas unitarias (Jest)
    │   ├─► 🔍 Ejecuta linter
    │   ├─► 💬 Comenta resultados en el PR
    │   ├─► 📱 Telegram: "Tests ejecutados: PASSED/FAILED"
    │   │
    │   ├─► Si FAILED:
    │   │   ├─► ⚠️ Aviso pero continúa (configurable)
    │   │   └─► 📱 Telegram: "Tests con advertencias"
    │   │
    │   └─► Si PASSED:
    │       ├─► ✅ Tests aprobados
    │       ├─► 🔀 Merge automático del PR a test
    │       └─► 📱 Telegram: "DEV → TEST: Merge exitoso"
    │
    └─► ✅ Código en rama test

3️⃣  PUSH a test (por merge automático)
    │
    ├─► 🚀 Workflow: promote-to-main.yml se activa
    │   │
    │   ├─► 🔄 Crea PR automático: test → main
    │   ├─► ⏱️ Espera 2 segundos
    │   ├─► 🔀 Intenta merge automático
    │   │
    │   ├─► Si merge exitoso:
    │   │   ├─► ✅ Código en main
    │   │   └─► 📱 Telegram: "TEST → MAIN: Merge exitoso + deploy"
    │   │
    │   └─► Si merge falló:
    │       ├─► ⚠️ PR creado pero sin merge
    │       └─► 📱 Telegram: "PR creado, esperando merge manual"
    │
    └─► 📝 PR mergeado a main

4️⃣  PUSH a main (por merge automático)
    │
    ├─► 🏗️ Workflow: deploy-to-production.yml se activa
    │   │
    │   ├─► 📦 Build de la aplicación (npm run build)
    │   ├─► 🐳 Build imagen Docker (opcional)
    │   ├─► 🚀 Deploy a Vercel
    │   │
    │   ├─► Si deploy exitoso:
    │   │   ├─► ✅ Aplicación desplegada
    │   │   ├─► 🏷️ Crea tag de release
    │   │   └─► 📱 Telegram: "Deploy exitoso + URL"
    │   │
    │   └─► Si deploy falló:
    │       ├─► ❌ Error en deploy
    │       └─► 📱 Telegram: "Deploy fallido + error"
    │
    └─► 🎉 APLICACIÓN EN PRODUCCIÓN
```

---

## 📱 Notificaciones Telegram por Etapa

### Etapa 1: Revisión de Seguridad
```
🔍 Etapa 1: INICIANDO REVISIÓN DE SEGURIDAD
📋 Commit: abc1234
👤 Autor: @usuario
📝 Mensaje: feat: nueva funcionalidad
```

**Resultado Seguro:**
```
✅ RESULTADO: CÓDIGO SEGURO
📊 Archivos analizados: 5
✓ No se detectaron vulnerabilidades
➡️ Continuando con el pipeline...
```

**Resultado Vulnerable:**
```
⚠️ RESULTADO: CÓDIGO VULNERABLE DETECTADO
📊 Archivos analizados: 5
🚨 Detalles:
- archivo.js: SQL Injection (probabilidad: 87.3%)
- otro.php: XSS (probabilidad: 92.1%)
❌ Commit rechazado - NO se creará PR
```

**PR Creado:**
```
✅ Etapa 1: ESCANEO DE SEGURIDAD EXITOSO
✓ Código seguro verificado
📝 PR creado automáticamente: dev → test
PR #45
🔗 https://github.com/...
➡️ Ejecutando pruebas automáticas...
```

### Etapa 2: Pruebas Unitarias
```
✅ Etapa 2: TESTS PASADOS
PR #45
✓ Pruebas unitarias completadas
✓ Linter ejecutado
➡️ Procediendo a merge...
```

**Merge Completado:**
```
✅ DEV → TEST: MERGE EXITOSO
📦 PR #45 mergeado
✓ Código en rama test
🔗 Commit: abc1234
➡️ Creando PR test → main...
```

### Etapa 3: Promoción a Main
```
✅ TEST → MAIN: MERGE EXITOSO
🚀 PR #46 mergeado
📦 Código promovido a producción
🔗 Iniciando deploy...
```

### Etapa 4: Deploy a Producción
```
🎉 DEPLOY EXITOSO
🌐 Aplicación desplegada en Vercel
📦 Release: v2025.12.18.2345
🔗 https://tu-app.vercel.app
```

---

## 🎯 Casos de Uso

### Caso 1: Flujo Exitoso Completo
```bash
# Developer hace cambios
git checkout dev
git add .
git commit -m "feat: add new feature"
git push origin dev

# 🤖 AUTOMÁTICO:
# ✅ Security check pasa
# ✅ PR dev→test creado (#45)
# ✅ Tests pasan
# ✅ Merge a test automático
# ✅ PR test→main creado (#46)
# ✅ Merge a main automático
# ✅ Deploy a Vercel
# ⏱️ Tiempo total: ~5-7 minutos
# 📱 5-6 notificaciones Telegram recibidas
```

### Caso 2: Código Vulnerable Detectado
```bash
git push origin dev

# 🤖 AUTOMÁTICO:
# ❌ Security check FALLA
# 🚨 Issue creada: "Vulnerabilidad detectada"
# 📱 Telegram: Detalles de vulnerabilidad
# ⛔ Pipeline detenido
# 
# Developer debe:
# 1. Ver issue creada
# 2. Corregir vulnerabilidad
# 3. Push nuevamente
```

### Caso 3: Tests Fallan
```bash
git push origin dev

# 🤖 AUTOMÁTICO:
# ✅ Security check pasa
# ✅ PR dev→test creado
# ⚠️ Tests FALLAN
# 📱 Telegram: "Tests fallidos"
# ⚠️ PR comentado con error
# ⏸️ Pipeline detenido en test
#
# Developer debe:
# 1. Ver comentarios en PR
# 2. Corregir tests
# 3. Push a dev nuevamente
```

---

## ⚙️ Configuración Necesaria

### 1. GitHub Secrets
```
TELEGRAM_TOKEN=bot123456:ABC-DEF...
TELEGRAM_CHAT_ID=123456789
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
```

### 2. Branch Protection (Opcional pero Recomendado)

#### Rama `test`:
- ✅ Require status checks: `security-scan`
- ✅ Require status checks: `run-tests`
- ❌ NO requerir approvals (para auto-merge)

#### Rama `main`:
- ✅ Require status checks
- ✅ Permitir merge solo desde `test`

### 3. Permisos en GitHub Actions
El workflow ya tiene los permisos necesarios:
- `contents: write` (para crear PRs y merge)
- `pull-requests: write` (para comentar)
- `issues: write` (para crear issues)

---

## 🔧 Troubleshooting

### "El workflow no se activa"
- ✅ Verificar que el push sea a la rama `dev`
- ✅ Verificar que `.github/workflows/` esté en la rama correcta
- ✅ Ver en GitHub Actions si hay errores de sintaxis

### "No recibo notificaciones Telegram"
- ✅ Verificar TELEGRAM_TOKEN y TELEGRAM_CHAT_ID en Secrets
- ✅ Probar bot manualmente: `/start` en Telegram
- ✅ Verificar logs del workflow para errores de curl

### "El PR no se crea automáticamente"
- ✅ Verificar que el security check haya pasado
- ✅ Ver logs del job `create-pr-to-test`
- ✅ Verificar permisos de GITHUB_TOKEN

### "El merge automático falla"
- ✅ Verificar que no haya conflictos
- ✅ Verificar branch protection rules
- ✅ Verificar que el PR esté listo para merge

---

## 📊 Métricas Esperadas

- **Tiempo total:** 5-7 minutos (commit → producción)
- **Notificaciones Telegram:** 5-6 por flujo completo
- **PRs creados:** 2 (dev→test, test→main)
- **Intervención manual:** 0 (si todo pasa)

---

**Fecha de actualización:** 18 de diciembre de 2025
