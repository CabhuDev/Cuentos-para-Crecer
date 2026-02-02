"""
Script para exportar contactos de la base de datos
Útil para backup y migración
"""
from database import SessionLocal, Contacto
import csv
import json
from datetime import datetime

def exportar_a_csv(nombre_archivo="contactos_export.csv"):
    """Exporta todos los contactos a CSV"""
    db = SessionLocal()
    contactos = db.query(Contacto).all()
    
    with open(nombre_archivo, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['ID', 'Email', 'Fecha Registro', 'Origen', 'Sincronizado Brevo'])
        
        for c in contactos:
            writer.writerow([
                c.id,
                c.email,
                c.fecha_registro.strftime('%Y-%m-%d %H:%M:%S'),
                c.origen,
                'Sí' if c.sincronizado_brevo else 'No'
            ])
    
    db.close()
    print(f"✅ {len(contactos)} contactos exportados a {nombre_archivo}")
    return len(contactos)

def exportar_a_json(nombre_archivo="contactos_export.json"):
    """Exporta todos los contactos a JSON"""
    db = SessionLocal()
    contactos = db.query(Contacto).all()
    
    datos = []
    for c in contactos:
        datos.append({
            'id': c.id,
            'email': c.email,
            'fecha_registro': c.fecha_registro.isoformat(),
            'origen': c.origen,
            'sincronizado_brevo': bool(c.sincronizado_brevo)
        })
    
    with open(nombre_archivo, 'w', encoding='utf-8') as jsonfile:
        json.dump(datos, jsonfile, indent=2, ensure_ascii=False)
    
    db.close()
    print(f"✅ {len(contactos)} contactos exportados a {nombre_archivo}")
    return len(contactos)

def mostrar_estadisticas():
    """Muestra estadísticas de la base de datos"""
    db = SessionLocal()
    
    total = db.query(Contacto).count()
    sincronizados = db.query(Contacto).filter(Contacto.sincronizado_brevo == 1).count()
    pendientes = total - sincronizados
    
    print("\n" + "="*50)
    print("📊 ESTADÍSTICAS DE CONTACTOS")
    print("="*50)
    print(f"Total de contactos: {total}")
    print(f"Sincronizados con Brevo: {sincronizados}")
    print(f"Pendientes de sincronizar: {pendientes}")
    print("="*50 + "\n")
    
    db.close()

if __name__ == "__main__":
    print("🔧 Herramienta de exportación de contactos\n")
    
    mostrar_estadisticas()
    
    print("¿Qué deseas hacer?")
    print("1. Exportar a CSV")
    print("2. Exportar a JSON")
    print("3. Ambos")
    
    opcion = input("\nSelecciona una opción (1-3): ").strip()
    
    if opcion == "1":
        exportar_a_csv()
    elif opcion == "2":
        exportar_a_json()
    elif opcion == "3":
        exportar_a_csv()
        exportar_a_json()
    else:
        print("❌ Opción no válida")
