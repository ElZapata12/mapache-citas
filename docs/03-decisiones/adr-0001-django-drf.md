---
adr: 0001
titulo: Django 5.2 LTS + Django REST Framework para la API, React para el frontend
estado: Aceptado
fecha: 2026-10-02
decisores: [equipo completo]
---

# ADR-0001 · Django + DRF para la API, React para el frontend

## Contexto

- Equipo de 3 personas, con Java y Python al mismo nivel.
- Plazo de 4 a 6 semanas hasta la entrega.
- Queremos una API REST separada y un frontend en React, como en la industria.
- La prioridad es aprender proceso y buenas prácticas, no solo entregar.
- La regla más delicada (RN-01, sin empalmes) necesita apoyo de la base de datos.

## Opciones evaluadas

| Criterio | Django + DRF | Spring Boot |
| --- | --- | --- |
| Primer endpoint funcionando | El mismo día | Más pasos: entidad, repositorio, DTO, servicio, controlador |
| Lo que ya trae | ORM con migraciones, autenticación, panel de administración | Inyección de dependencias, tipado fuerte, ecosistema empresarial |
| Riesgo con el plazo y React aparte | Bajo | Alto |
| Su trampa | La «magia» esconde conceptos | La configuración consume el tiempo |

## Decisión

Usamos **Django 5.2 LTS** con **Django REST Framework** para la API, **React + Vite** para el frontend y **PostgreSQL**. Elegimos la versión LTS (soporte de seguridad hasta abril de 2028) y no la más nueva (6.1, soporte hasta diciembre de 2027), porque en proyectos reales se prefiere estabilidad.

## Consecuencias

**Lo que ganamos**

- El panel de administración de Django sirve para capturar barberos y servicios mientras no existan sus pantallas.
- `ExclusionConstraint` de PostgreSQL permite que la base de datos también impida empalmes.
- Más tiempo para practicar proceso: specs, revisiones, pruebas e integración continua.

**Lo que aceptamos y cómo lo mitigamos**

- *La magia de Django puede esconder conceptos.* Mitigación: reglas de negocio en `services.py`; empezar con `APIView` y vistas genéricas antes de `ViewSets`; leer el SQL de cada migración con `sqlmigrate`.
- *Adoptamos convenciones de Django* (`id`, `barbero_id`) en lugar de las del documento inicial (`id_barbero`). Ver [modelo de datos](../01-producto/modelo-de-datos.md).
- *Spring Boot queda para un proyecto futuro*, cuando el equipo domine el proceso.

## Fuentes

- [Django · versiones soportadas](https://www.djangoproject.com/download/)
- [Spring Boot · fechas de soporte](https://endoflife.date/spring-boot)
