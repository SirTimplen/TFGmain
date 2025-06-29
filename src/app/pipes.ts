import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filtroAlumnos' })
export class FiltroAlumnosPipe implements PipeTransform {
  transform(alumnos: any[], carrera: string): any[] {
    if (!carrera) return alumnos;
    return alumnos.filter(a => a.carrera === carrera);
  }
}

@Pipe({ name: 'filtroLineas' })
export class FiltroLineasPipe implements PipeTransform {
  transform(lineas: any[], tutor: string, ambito: string): any[] {
    return lineas.filter(linea =>
      (!tutor || linea.tutor === tutor) &&
      (!ambito || linea.ambito === ambito)
    );
  }
}

// (Removed duplicate export to avoid redeclaration error)