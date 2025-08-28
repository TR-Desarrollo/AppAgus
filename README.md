# AppAgus - PWA Dashboard de Presupuestos

Una Progressive Web App (PWA) moderna y responsiva para la gestión de presupuestos y finanzas personales.

## 🚀 Características

- **PWA Completa**: Instalable en dispositivos móviles y de escritorio
- **Dashboard Moderno**: Interfaz limpia y profesional con diseño responsivo
- **Funcionalidad Offline**: Funciona sin conexión a internet
- **Botón de Presupuesto**: Acceso rápido a la gestión de presupuestos
- **Diseño Adaptativo**: Se adapta a diferentes tamaños de pantalla
- **Tema Oscuro**: Soporte automático para modo oscuro del sistema
- **Notificaciones**: Sistema de notificaciones integrado
- **Service Worker**: Cache inteligente para mejor rendimiento

## 📱 Instalación

### Como PWA (Recomendado)
1. Abre la aplicación en Chrome, Edge o Safari
2. Verás un botón "Instalar" en la barra de direcciones
3. Haz clic en "Instalar" para agregar la app a tu dispositivo
4. La app aparecerá en tu pantalla de inicio

### Desarrollo Local
1. Clona o descarga este repositorio
2. Abre una terminal en la carpeta del proyecto
3. Ejecuta un servidor local:
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js
   npx serve .
   
   # Con PHP
   php -S localhost:8000
   ```
4. Abre tu navegador en `http://localhost:8000`

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+**: Funcionalidad moderna y modular
- **Service Worker**: Funcionalidad offline y cache
- **Web App Manifest**: Configuración PWA
- **Responsive Design**: Mobile-first approach

## 📁 Estructura del Proyecto

```
AppAgus/
├── index.html          # Página principal del dashboard
├── styles.css          # Estilos CSS modernos
├── app.js             # Funcionalidad JavaScript
├── manifest.json      # Configuración PWA
├── sw.js             # Service Worker
├── icons/            # Iconos de la aplicación
├── Presupuesto/      # Módulo completo de presupuestos
│   ├── index.html    # Sistema de presupuestos con wizard
│   ├── sw.js         # Service Worker del módulo
│   └── Logo.jpg      # Logo de la empresa
├── test-connection.html # Página de prueba de conexión
└── README.md         # Este archivo
```

## 🎯 Funcionalidades Principales

### Dashboard Principal
- **Sección de Bienvenida**: Mensaje personalizado al usuario
- **Acciones Rápidas**: Botones para funciones principales
- **Resumen del Mes**: Estadísticas financieras clave
- **Navegación Intuitiva**: Diseño claro y fácil de usar

### Botón de Presupuesto
- **Módulo Completo**: Se abre el módulo completo de presupuestos
- **Navegación Integrada**: Botón "Volver al Dashboard" para regresar
- **Funcionalidad Completa**: Sistema de presupuestos con wizard de 4 pasos
- **Diseño Responsivo**: Se adapta a todos los dispositivos

### Funcionalidades PWA
- **Instalación**: Se puede instalar como app nativa
- **Offline**: Funciona sin conexión a internet
- **Cache Inteligente**: Almacena recursos para mejor rendimiento
- **Notificaciones**: Sistema de alertas integrado

### Módulo de Presupuesto
- **Sistema Completo**: Wizard de 4 pasos para crear presupuestos
- **Formularios Avanzados**: Captura de datos del cliente, tipo de viaje, detalles y vista previa
- **Generación de PDF**: Exporta presupuestos en formato PDF
- **Compartir**: Funcionalidad para compartir presupuestos
- **Navegación Integrada**: Botón para volver al dashboard principal

## 🔧 Personalización

### Colores
Los colores se pueden personalizar editando las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #2563eb;      /* Color principal */
    --primary-dark: #1d4ed8;       /* Color principal oscuro */
    --background-color: #f8fafc;   /* Color de fondo */
    --surface-color: #ffffff;      /* Color de superficies */
}
```

### Contenido
- Edita `index.html` para cambiar el contenido del dashboard
- Modifica `app.js` para agregar nuevas funcionalidades
- Actualiza `manifest.json` para cambiar la información de la PWA

## 📱 Compatibilidad

### Navegadores
- ✅ Chrome 67+
- ✅ Edge 79+
- ✅ Firefox 67+
- ✅ Safari 11.1+
- ✅ Opera 54+

### Dispositivos
- ✅ Móviles (Android/iOS)
- ✅ Tablets
- ✅ Escritorio
- ✅ PWA instalada

## 🚀 Próximas Funcionalidades

- [ ] Sistema de autenticación de usuarios
- [ ] Base de datos local con IndexedDB
- [ ] Sincronización con servidor
- [ ] Notificaciones push
- [ ] Más categorías de gastos
- [ ] Gráficos y reportes avanzados
- [ ] Exportación de datos
- [ ] Múltiples monedas

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema:

- Abre un issue en GitHub
- Contacta al equipo de desarrollo
- Revisa la documentación técnica

## 🎉 Agradecimientos

- Comunidad PWA por las mejores prácticas
- Desarrolladores de herramientas web modernas
- Usuarios que prueban y dan feedback

---

**AppAgus** - Haciendo la gestión financiera más inteligente y accesible. 💰📱
