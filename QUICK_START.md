# ⚡ QUICK START - PRÓXIMOS PASOS

## 🎯 Lo que debes hacer AHORA

### 1️⃣ Crear Token de Telegram (5 min)

```
1. Abre Telegram
2. Busca @BotFather
3. Escribe /newbot
4. Sigue las instrucciones
5. Copia el TOKEN que te da
```

**Obtener Chat ID:**
```
1. Abre tu bot nuevo
2. Escribe cualquier mensaje (ej: "hola")
3. Ve a: https://api.telegram.org/bot{TU_TOKEN}/getUpdates
4. Busca "chat":{"id": XXXXX
5. Copia ese número
```

### 2️⃣ Guardar Secrets en GitHub

```bash
# Ve a tu repo en GitHub:
Settings → Secrets and variables → Actions → New repository secret

Crea estos 3:

Nombre: TELEGRAM_TOKEN
Valor: abc123:xxxxxxxx (lo que sacaste de BotFather)

Nombre: TELEGRAM_CHAT_ID  
Valor: 123456789 (el número que sacaste de getUpdates)

Nombre: RENDER_DEPLOY_HOOK
Valor: (Lo dejaremos para después)
```

### 3️⃣ Elegir Hosting (elige UNO)

#### Opción A: RENDER (RECOMENDADO - Lo más fácil)

```bash
1. Ve a https://render.com
2. Sign up con GitHub
3. New → Web Service
4. Conecta tu repositorio
5. Settings:
   - Runtime: Docker
   - Build Command: (dejar vacío)
   - Start Command: (dejar vacío)
6. En Deploy Hook copias la URL
7. Vuelve a GitHub Secrets y agrega:
   Nombre: RENDER_DEPLOY_HOOK
   Valor: [la URL que copiaste]
```

#### Opción B: VERCEL (Para React)

```bash
1. Ve a https://vercel.com
2. Sign up con GitHub
3. New Project → Select Repository
4. Import "proyect" folder
5. Deploy!
6. Copia los valores de Account Settings → Tokens
```

#### Opción C: FLY.IO

```bash
1. Ve a https://fly.io
2. Sign up
3. Sigue documentación oficial
```

### 4️⃣ Instalar dependencias (en tu máquina)

```bash
cd "c:\Users\kleen\OneDrive\Desktop\Uni\sexto\desarrollo de software seguro\Proyecto_Segundo_SF\proyect"
npm install
```

### 5️⃣ Crear un PR de PRUEBA

```bash
# En tu terminal Git:
git checkout dev

# Haz un cambio pequeño:
echo "// Test" >> src/App.tsx

# Commit y push:
git add .
git commit -m "test: prueba del pipeline"
git push origin dev
```

### 6️⃣ Crea el PR en GitHub

```
1. Ve a Pull Requests
2. Click en "New Pull Request"
3. Base: test
4. Compare: dev
5. Click "Create Pull Request"
6. ¡AHORA VE A Actions Y MIRA CÓMO CORRE TODO! 🚀
```

---

## ✅ Lo que pasará automáticamente

**Paso 1: Security Check**
- El modelo ML analiza tu código
- Comentará en el PR si encontró vulnerabilidades
- Recibirás notificación en Telegram

**Si pasó seguridad:**

**Paso 2: Merge + Tests**  
- Automáticamente mergeará a `test`
- Ejecutará los tests
- Si todo bien, Telegram te avisa

**Paso 3: Deploy**
- Automáticamente mergeará a `main`
- Build Docker
- Deploy a Render/Vercel/Fly.io
- ¡Tu app está VIVA! 

---

## 📊 Orden de tareas

- [ ] Crear bot Telegram con BotFather
- [ ] Obtener TOKEN y CHAT_ID
- [ ] Guardar en GitHub Secrets
- [ ] Elegir hosting (Render es más fácil)
- [ ] Crear cuenta en hosting
- [ ] Obtener DEPLOY_HOOK y guardar en Secrets
- [ ] Instalar dependencias localmente: `npm install` en proyect/
- [ ] Hacer cambio pequeño en dev
- [ ] Hacer push a dev
- [ ] Crear PR dev → test
- [ ] ¡Observar el pipeline en Actions! 👀

---

## 🚨 IMPORTANTE

Si algo falla en los tests localmente, el workflow también fallará. Antes de hacer PR, asegúrate que todo corre bien localmente:

```bash
cd proyect
npm test -- --passWithNoTests
```

---

## 📞 Si algo no funciona

1. **Tests fallan localmente**
   - Mira qué falla: `npm test`
   - Arrégla el test (están en `src/__tests__/`)

2. **Telegram no notifica**
   - Verifica que el TOKEN sea correcto
   - Abre el Deploy Hook en tu navegador
   - Si ves error 400: El TOKEN es incorrecto

3. **Deploy no se ejecuta**
   - Verifica que RENDER_DEPLOY_HOOK sea una URL válida
   - Comprueba que comience con `https://api.render.com`

---

## 🎉 Una vez que funcione TODO

¡Felicidades! Tienes un CI/CD seguro y automatizado. Cada PR que hagas:

1. ✅ Se analizará automáticamente por vulnerabilidades
2. ✅ Si es seguro, se mergeará a test y pasará tests
3. ✅ Si todo bien, se deployará a producción
4. ✅ Recibirás notificaciones en Telegram en cada paso

**TODO AUTOMÁTICO** 🤖

---

¡Vamos! Empieza con el bot de Telegram 👆
