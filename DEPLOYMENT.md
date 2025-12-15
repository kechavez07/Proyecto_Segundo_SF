# 🚀 CI/CD Pipeline - Guía de Configuración

## 📋 Requisitos completados

✅ **Etapa 1:** Revisión de Seguridad con ML
- Análisis automático de código usando modelo scikit-learn
- Comentarios en PR con resultados detallados
- Creación automática de issues
- Notificaciones Telegram

✅ **Etapa 2:** Merge a test + Pruebas
- Merge automático a rama `test` si pasa seguridad
- Ejecución de pruebas unitarias (Jest)
- Notificaciones Telegram de resultados

✅ **Etapa 3:** Merge a main + Deploy
- Merge automático a `main` si pasan pruebas
- Build Docker
- Despliegue automático a proveedor de hosting
- Notificaciones Telegram de éxito/fallo

---

## 🔐 Configuración de Secrets en GitHub

Necesitas configurar estos secrets en tu repositorio (Settings → Secrets and variables → Actions):

### 1. **Telegram (OBLIGATORIO)**
```
TELEGRAM_TOKEN=Tu_Token_Bot_Telegram
TELEGRAM_CHAT_ID=Tu_Chat_ID
```

**Cómo obtenerlos:**
1. Crea un bot con [@BotFather](https://t.me/BotFather) en Telegram
2. Copia el token y guárdalo como `TELEGRAM_TOKEN`
3. Manda un mensaje a tu bot y obtén el Chat ID desde https://api.telegram.org/bot{token}/getUpdates
4. Guarda como `TELEGRAM_CHAT_ID`

### 2. **Proveedor de Hosting (Elige uno)**

#### Opción A: Render (RECOMENDADO)
```
RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxxxxxxxxxxxx?key=xxxxxxx
```

**Cómo obtenerlo:**
1. Crea una cuenta en [Render](https://render.com)
2. Conecta tu repositorio GitHub
3. Crea un nuevo Web Service con Docker
4. En Settings → Deploy Hook, copia la URL
5. Guarda como `RENDER_DEPLOY_HOOK`

#### Opción B: Vercel
```
VERCEL_TOKEN=Token_Vercel
VERCEL_ORG_ID=ID_Org
VERCEL_PROJECT_ID=ID_Project
```

**Cómo obtenerlo:**
1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio GitHub
3. Obtén tokens desde Account Settings → Tokens

#### Opción C: Fly.io
```
FLY_API_TOKEN=Tu_Token_Fly_io
```

---

## 🔄 Flujo de trabajo

### Paso 1: Desarrollo en rama `dev`
```bash
git checkout dev
# Haz tus cambios
git add .
git commit -m "feat: nueva funcionalidad"
git push origin dev
```

### Paso 2: Crear PR dev → test
En GitHub, crea un Pull Request de `dev` → `test`

**Automáticamente se ejecutarán:**
1. ✅ **Etapa 1 - Security Check** (~2 min)
   - Análisis de seguridad
   - Comentario en PR con resultados
   - Notificación Telegram
   - Si hay vulnerabilidades → **RECHAZA EL PR**

2. ✅ **Etapa 2 - Merge & Tests** (si pasó seguridad)
   - Merge automático a `test`
   - Ejecución de tests unitarios
   - Notificación de resultados

3. ✅ **Etapa 3 - Deploy** (si pasaron todas las etapas)
   - Merge automático a `main`
   - Build Docker
   - Despliegue a producción
   - Creación de release tag
   - Notificación de éxito

---

## 📝 Estructura del Proyecto

```
.
├── .github/workflows/
│   ├── security_check.yml       # Etapa 1: Seguridad
│   ├── merge-and-test.yml       # Etapa 2: Merge + Tests
│   └── deploy-to-production.yml # Etapa 3: Deploy
├── proyect/
│   ├── src/
│   │   ├── __tests__/           # Tests unitarios
│   │   ├── components/
│   │   └── ...
│   ├── jest.config.ts
│   └── package.json
├── Dockerfile                    # Docker image config
├── render.yaml                   # Render deployment config
└── git_scan_commits.py          # Script de análisis de seguridad
```

---

## ✅ Checklist de Configuración

- [ ] Crear cuenta en Telegram y obtener token + chat ID
- [ ] Guardar `TELEGRAM_TOKEN` en GitHub Secrets
- [ ] Guardar `TELEGRAM_CHAT_ID` en GitHub Secrets
- [ ] Elegir proveedor de hosting (Render/Vercel/Fly.io)
- [ ] Crear cuenta en proveedor elegido
- [ ] Configurar Deploy Hook en GitHub Secrets
- [ ] Verificar que las ramas `dev`, `test`, `main` existen
- [ ] Hacer un PR de prueba dev → test
- [ ] Verificar que se ejecutan todos los workflows

---

## 🐛 Troubleshooting

### "No vulnerabilities detected" pero no mergea
- ✓ Verifica que el resultado JSON se genere correctamente
- ✓ Revisa los logs del job `parse results`
- ✓ Asegúrate que el modelo ML está entrenado

### Tests fallan pero quieres avanzar
- Edita `merge-and-test.yml` y cambia `continue-on-error: true` si necesitas
- O arregla los tests unitarios

### Deploy no se ejecuta
- Verifica que el RENDER_DEPLOY_HOOK esté correcto
- Revisa que sea una URL HTTPS válida
- Confirma que el servicio existe en Render

### Notificaciones Telegram no llegan
- Verifica el token: https://api.telegram.org/bot{TOKEN}/getMe
- Verifica el chat ID enviando un mensaje al bot
- Abre el workflow en "Run workflow" → permite notificaciones

---

## 📞 Soporte

Cada workflow genera un comentario en el PR con detalles completos.
Revisa la sección "Checks" en tu PR para ver el estado en tiempo real.

¡Éxito en tu CI/CD seguro! 🎯
