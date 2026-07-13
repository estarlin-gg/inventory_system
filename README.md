# MimaApp - Sistema de Inventario

Aplicación de gestión de inventario desarrollada con React + TypeScript, Supabase y Electron.

## Funcionalidades

### Gestión de Productos
- Crear, editar y eliminar productos
- Control de stock con validación en tiempo real
- Asociación de productos a proveedores
- Costo y precio de venta por producto
- Descuentos por unidad

### Gestión de Ventas
- Registro de ventas con múltiples productos
- Validación automática de stock disponible
- Cálculo de totales con descuentos
- Historial de ventas con filtros por fecha

### Gestión de Proveedores
- CRUD completo de proveedores (nombre, email, teléfono, dirección)
- Página de detalle con productos asociados
- Análisis de inversión por proveedor

### Analytics
- Dashboard general con métricas de ventas, ingresos y ganancias
- Análisis financiero por producto (costo, precio, ganancia, ROI)
- Análisis por proveedor (inversión, revenue, profit)
- Filtros por rango de fechas y búsqueda

### Offline-First
- La app funciona completamente sin conexión a internet
- Datos almacenados en IndexedDB mediante la librería `idb`
- Cola de sincronización automática al recuperar conexión
- Indicador de estado de conexión en el sidebar
- Persistencia de sesión de auth offline

### App de Escritorio
- Empaquetada con Electron para Windows, macOS y Linux
- Funciona como aplicación de escritorio independiente
- Instalador NSIS para Windows

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| UI | Flowbite React |
| State | Zustand |
| Server State | TanStack React Query |
| Backend | Supabase (PostgreSQL, Auth, RLS) |
| Formularios | React Hook Form + Zod |
| Gráficos | Recharts |
| Alertas | SweetAlert2, React Toastify |
| Offline | IndexedDB (librería `idb`) |
| Desktop | Electron + electron-builder |
| Paquete | pnpm |

## Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

### Variables de entorno (.env)

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

## Desarrollo

```bash
# Web - servidor de desarrollo
pnpm dev

# Electron - modo desarrollo (con hot reload)
pnpm electron:dev:watch

# Electron - modo producción (build + ejecutar)
pnpm electron:dev
```

## Build

```bash
# Web
pnpm build

# Electron - Windows
pnpm electron:build:win

# Electron - macOS
pnpm electron:build:mac

# Electron - Linux
pnpm electron:build:linux
```

Los instaladores se generan en la carpeta `release/`.

## Estructura del Proyecto

```
src/
├── actions/          # Funciones de mutación (create, update, delete)
├── components/       # Componentes UI reutilizables
│   ├── analytics/    # Tabs y componentes de analytics
│   ├── products/     # Formularios y listas de productos
│   ├── sales/        # Componentes de ventas
│   └── suppliers/    # Componentes de proveedores
├── hooks/            # Custom hooks (auth, analytics, filtros)
├── layouts/          # Layouts de navegación
├── models/           # Schemas Zod e interfaces TypeScript
├── pages/            # Páginas principales
├── queries/          # Hooks de React Query (fetch + offline)
├── routes/           # Configuración de rutas
├── services/         # Servicios de Supabase
│   └── offline/      # Servicio offline (IndexedDB, sync)
├── store/            # Estado global con Zustand
└── utils/            # Utilidades compartidas
electron/
├── main.cjs          # Proceso principal de Electron
└── preload.cjs       # Script de contexto seguro
```

## Base de Datos

Requiere las siguientes migraciones en Supabase:

```sql
-- Tabla de proveedores
CREATE TABLE suppliers (
  supplier_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Columnas en productos
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost NUMERIC DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_id INTEGER REFERENCES suppliers(supplier_id);

-- Columna de costo en sale_products
ALTER TABLE sale_products ADD COLUMN IF NOT EXISTS cost NUMERIC DEFAULT 0;
```
