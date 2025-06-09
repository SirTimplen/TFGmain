import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private pathLineas = '/ingenieria_informatica/grado2024-2025/linea';
  private pathSolicitudes = '/ingenieria_informatica/grado2024-2025/solicitud';
  private pathTribunales = '/ingenieria_informatica/grado2024-2025/convocatorias/convocatoria_junio/tribunales';

  private userTypeSubject = new BehaviorSubject<'usuario' | 'tutor' | 'admin' | null>(null);
  userType$ = this.userTypeSubject.asObservable();

  constructor() {}

  async login(email: string, password: string): Promise<'usuario' | 'tutor' | 'admin'> {
    const auth = getAuth();
    const db = getFirestore();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const usuarioQuery = query(collection(db, 'Usuario'), where('Correo', '==', email));
      const tutorQuery = query(collection(db, 'Tutor'), where('Correo', '==', email));
      const adminQuery = query(collection(db, 'admin'), where('Correo', '==', email));

      const usuarioSnapshot = await getDocs(usuarioQuery);
      const tutorSnapshot = await getDocs(tutorQuery);
      const adminSnapshot = await getDocs(adminQuery);

      let userType: 'usuario' | 'tutor' | 'admin';

      if (!usuarioSnapshot.empty) {
        userType = 'usuario';
      } else if (!tutorSnapshot.empty) {
        userType = 'tutor';
      } else if (!adminSnapshot.empty) {
        userType = 'admin';
      } else {
        throw new Error('Usuario no encontrado');
      }

      this.setUserType(userType);
      localStorage.setItem('userType', userType);
      localStorage.setItem('email', email);
      return userType;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  setUserType(type: 'usuario' | 'tutor' | 'admin') {
    this.userTypeSubject.next(type);
  }

  logout() {
    this.userTypeSubject.next(null);
    localStorage.removeItem('userType');
    localStorage.removeItem('email');
  }

  private db = getFirestore();
  async obtenerLineas(): Promise<any[]> {
    try {
      const lineasRef = collection(this.db, this.pathLineas);
      const snapshot = await getDocs(lineasRef);

      // Mapea los datos y asegúrate de que todos los campos estén presentes
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id, // Incluye el ID del documento
          titulo: data['titulo'] || 'Sin título',
          ambito: data['ambito'] || 'Sin ámbito',
          descripcion: data['descripcion'] || 'Sin descripción',
          plazasOriginal: data['plazasOriginal'] || 0,
          alumnos: data['alumnos'] || [],
          plazasLibres: data['plazasOriginal'] - (data['alumnos'] || []).length,
          tutor: data['tutor'] || 'Sin tutor',
        };
      });
    } catch (error) {
      console.error('Error al obtener las líneas:', error);
      throw error;
    }
  }

  async obtenerSolicitudes(): Promise<any[]> {
    try {
      const userEmail = await this.getUserEmail(); // Obtén el correo del usuario autenticado
      if (!userEmail) {
        throw new Error('Usuario no autenticado');
      }

      const solicitudesRef = collection(this.db, this.pathSolicitudes);
      const usuarioQuery = query(solicitudesRef, where('usuario', '==', userEmail)); // Filtra por el correo del usuario
      const snapshot = await getDocs(usuarioQuery);

      const solicitudes = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();

          // Obtén el nombre de la línea
          const lineaDoc = await getDoc(doc(this.db, this.pathLineas, this.pathLineas));
          const lineaNombre = lineaDoc.exists() ? lineaDoc.data()?.['titulo'] || 'Sin título' : 'Sin título';

          // Obtén el nombre del tutor
          const tutorQuery = query(collection(this.db, 'Tutor'), where('Correo', '==', data['tutor']));
          const tutorSnapshot = await getDocs(tutorQuery);
          const tutorNombre = !tutorSnapshot.empty
            ? tutorSnapshot.docs[0].data()?.['Nombre'] || 'Sin nombre'
            : 'Sin nombre';

          // Obtén el nombre del usuario
          const usuarioQuery = query(collection(this.db, 'Usuario'), where('Correo', '==', data['usuario']));
          const usuarioSnapshot = await getDocs(usuarioQuery);
          const usuarioNombre = !usuarioSnapshot.empty
            ? usuarioSnapshot.docs[0].data()?.['Nombre'] || 'Sin nombre'
            : 'Sin nombre';

          return {
            id: docSnapshot.id,
            linea: lineaNombre, // Muestra el nombre de la línea
            tutor: tutorNombre, // Muestra el nombre del tutor
            usuario: usuarioNombre, // Muestra el nombre del usuario
            fecha: data['fecha'],
            estado: data['estado'],
          };
        })
      );

      return solicitudes;
    } catch (error) {
      console.error('Error al obtener las solicitudes:', error);
      throw error;
    }
  }

  getUserType(): 'usuario' | 'tutor' | 'admin' | null {
      return localStorage.getItem('userType') as 'usuario' | 'tutor' | 'admin' | null;
  }

  async crearLinea(linea: any, tutorEmail: string): Promise<void> {
    try {
      const lineasRef = collection(this.db, this.pathLineas);
      // Asegura que los campos sean number
      const plazasOriginal = Number(linea.plazasOriginal);
      const alumnos: string[] = [];
      await addDoc(lineasRef, {
        ...linea,
        tutor: tutorEmail,
        plazasOriginal,
        alumnos
      });
      console.log('Línea creada con éxito');
    } catch (error) {
      console.error('Error al crear la línea:', error);
      throw error;
    }
  }

  async obtenerLineasPorTutor(tutorEmail: string): Promise<any[]> {
    try {
      const lineasRef = collection(this.db, this.pathLineas);
      const tutorQuery = query(lineasRef, where('tutor', '==', tutorEmail));
      const snapshot = await getDocs(tutorQuery);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          titulo: data['titulo'] || 'Sin título',
          ambito: data['ambito'] || 'Sin ámbito',
          descripcion: data['descripcion'] || 'Sin descripción',
          plazasOriginal: data['plazasOriginal'] || 0,
          alumnos: data['alumnos'] || [],
          plazasLibres: data['plazasOriginal'] - (data['alumnos'] || []).length,
          tutor: data['tutor'] || 'Sin tutor',
        };
      });
    } catch (error) {
      console.error('Error al obtener las líneas del tutor:', error);
      throw error;
    }
  }

  async actualizarLinea(lineaId: string, linea: any): Promise<void> {
    try {
      const lineaRef = doc(this.db, this.pathLineas, lineaId);
      const lineaSnapshot = await getDoc(lineaRef);

      if (!lineaSnapshot.exists()) {
        throw new Error('Línea no encontrada');
      }

      const lineaData = lineaSnapshot.data();
      const alumnos = lineaData['alumnos'] || [];

      // Fuerza los campos a number antes de actualizar
      if (linea.plazasOriginal !== undefined) {
        linea.plazasOriginal = Number(linea.plazasOriginal);
      }

      // Recalcula las plazas libres
      linea.plazasLibres = linea.plazasOriginal - alumnos.length;

      await updateDoc(lineaRef, linea);
      console.log('Línea actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la línea:', error);
      throw error;
    }
  }

  async getUserEmail(): Promise<string | null> {
    return localStorage.getItem('email') as string | null;
  }

  async obtenerSolicitudesPorTutor(tutorEmail: string): Promise<any[]> {
    try {
      const solicitudesRef = collection(this.db, this.pathSolicitudes);
      const tutorQuery = query(solicitudesRef, where('tutor', '==', tutorEmail));
      const snapshot = await getDocs(tutorQuery);

      const solicitudes = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();

          // Obtén el nombre y correo del alumno
          const usuarioQuery = query(collection(this.db, 'Usuario'), where('Correo', '==', data['usuario']));
          const usuarioSnapshot = await getDocs(usuarioQuery);
          const alumno = usuarioSnapshot.docs[0]?.data() || {};

          // Obtén el título de la línea
          const lineaDoc = await getDoc(doc(this.db, this.pathLineas, data['linea']));
          const lineaTitulo = lineaDoc.exists() ? lineaDoc.data()?.['titulo'] || 'Sin título' : 'Sin título';

          return {
            id: docSnapshot.id,
            linea: lineaTitulo,
            alumnoNombre: alumno['Nombre'] || 'Sin nombre',
            alumnoCorreo: alumno['Correo'] || 'Sin correo',
            estado: data['estado'],
          };
        })
      );

      return solicitudes;
    } catch (error) {
      console.error('Error al obtener las solicitudes por tutor:', error);
      throw error;
    }
  }

  async actualizarEstadoSolicitud(solicitudId: string, estado: string): Promise<void> {
    try {
      const solicitudRef = doc(this.db, this.pathSolicitudes, solicitudId);
      const solicitudSnapshot = await getDoc(solicitudRef);
      if (!solicitudSnapshot.exists()) {
        throw new Error('Solicitud no encontrada');
      }

      const solicitudData = solicitudSnapshot.data();
      const lineaRef = doc(this.db, this.pathLineas, solicitudData['linea']);
      const lineaSnapshot = await getDoc(lineaRef);

      if (!lineaSnapshot.exists()) {
        throw new Error('Línea no encontrada');
      }

      const lineaData = lineaSnapshot.data();
      const alumnos = lineaData['alumnos'] || [];

      if (estado === 'Aceptada' && solicitudData['estado'] !== 'Aceptada') {
        if (lineaData['plazasLibres'] > 0) {
          // Añade el correo del alumno al array de alumnos
          alumnos.push(solicitudData['usuario']);
        } else {
          throw new Error('No hay plazas disponibles');
        }
      } else if (estado === 'Rechazada por tutor' && solicitudData['estado'] === 'Aceptada') {
        // Remueve el correo del alumno del array de alumnos si existe
        const index = alumnos.indexOf(solicitudData['usuario']);
        if (index > -1) {
          alumnos.splice(index, 1);
        }
      }

      // Recalcula las plazas libres
      const plazasLibres = lineaData['plazasOriginal'] - alumnos.length;

      // Actualiza el estado de la solicitud
      await updateDoc(solicitudRef, { estado });

      // Actualiza las plazas libres y el array de alumnos de la línea
      await updateDoc(lineaRef, { plazasLibres, alumnos });

      console.log(`Estado de la solicitud actualizado a: ${estado}`);
    } catch (error) {
      console.error('Error al actualizar el estado de la solicitud:', error);
      throw error;
    }
  }

  async crearSolicitud(tutorId: string, lineaId: string): Promise<void> {
    try {
      const userEmail = await this.getUserEmail(); // Obtén el correo del usuario autenticado
      if (!userEmail) {
        throw new Error('Usuario no autenticado');
      }

      const lineaRef = doc(this.db, this.pathLineas, lineaId);
      const lineaSnapshot = await getDoc(lineaRef);

      if (!lineaSnapshot.exists()) {
        throw new Error('Línea no encontrada');
      }

      const lineaData = lineaSnapshot.data();
      if (lineaData['plazasLibres'] <= 0) {
        throw new Error('No hay plazas disponibles para esta línea');
      }

      const solicitudesRef = collection(this.db, this.pathSolicitudes);
      const usuarioQuery = query(
        solicitudesRef,
        where('usuario', '==', userEmail),
        where('estado', 'in', ['Pendiente', 'Aceptada por tutor'])
      );
      const snapshot = await getDocs(usuarioQuery);

      if (!snapshot.empty) {
        throw new Error('Ya tienes una solicitud pendiente o aceptada.');
      }

      await addDoc(solicitudesRef, {
        tutor: tutorId,
        usuario: userEmail,
        linea: lineaId,
        fecha: new Date().toISOString(),
        estado: 'Pendiente',
        asignacion: false,
      });

      console.log('Solicitud creada con éxito');
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      throw error;
    }
  }

  async borrarLinea(lineaId: string): Promise<void> {
    try {
      const lineaRef = doc(this.db, this.pathLineas, lineaId);
      await deleteDoc(lineaRef);
      console.log('Línea borrada con éxito');
    } catch (error) {
      console.error('Error al borrar la línea:', error);
      throw error;
    }
  }

  async cancelarSolicitud(solicitudId: string): Promise<void> {
    try {
      const solicitudRef = doc(this.db, this.pathSolicitudes, solicitudId);
      const solicitudSnapshot = await getDoc(solicitudRef);

      if (!solicitudSnapshot.exists()) {
        throw new Error('Solicitud no encontrada');
      }

      const solicitudData = solicitudSnapshot.data();
      const lineaRef = doc(this.db, this.pathLineas, solicitudData['linea']);
      const lineaSnapshot = await getDoc(lineaRef);

      if (!lineaSnapshot.exists()) {
        throw new Error('Línea no encontrada');
      }

      const lineaData = lineaSnapshot.data();
      const alumnos = lineaData['alumnos'] || [];

      // Remove the user from the list of students if they exist
      const index = alumnos.indexOf(solicitudData['usuario']);
      if (index > -1) {
        alumnos.splice(index, 1);
      }

      // Increment the available slots
      const plazasLibres = lineaData['plazasOriginal'] - alumnos.length;

      // Update the line with the new list of students and available slots
      await updateDoc(lineaRef, { plazasLibres, alumnos });

      // Update the request instead of deleting it
      await updateDoc(solicitudRef, {
        estado: 'Rechazada por admin',
        asignacion: false
      });

      console.log('Solicitud cancelada y línea actualizada con éxito');
    } catch (error) {
      console.error('Error al cancelar la solicitud:', error);
      throw error;
    }
  }

  async obtenerSolicitudesAceptadas(): Promise<any[]> {
    try {
      const solicitudesRef = collection(this.db, this.pathSolicitudes);
      const acceptedQuery = query(solicitudesRef, where('estado', '==', 'Aceptada'));
      const snapshot = await getDocs(acceptedQuery);

      const solicitudes = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();

          // Obtener el título de la línea usando el ID de la línea
          const lineaDoc = await getDoc(doc(this.db, this.pathLineas, data['linea']));
          const lineaTitulo = lineaDoc.exists() ? lineaDoc.data()?.['titulo'] || 'Sin título' : 'Sin título';

          return {
            id: docSnapshot.id,
            tutor: data['tutor'],
            usuario: data['usuario'],
            linea: lineaTitulo,
            fecha: data['fecha'],
            estado: data['estado'],
            asignacion: data['asignacion'] || false,
          };
        })
      );

      return solicitudes;
    } catch (error) {
      console.error('Error al obtener las solicitudes aceptadas:', error);
      throw error;
    }
  }

  async actualizarSolicitud(solicitudId: string, solicitud: any): Promise<void> {
    try {
      const solicitudRef = doc(this.db, this.pathSolicitudes, solicitudId);
      await updateDoc(solicitudRef, solicitud);
      console.log('Solicitud actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
      throw error;
    }
  }

  async obtenerTribunales(): Promise<any[]> {
    try {
      const tribunalesRef = collection(this.db, this.pathTribunales);
      const snapshot = await getDocs(tribunalesRef);

      const tribunales = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          fecha: data['fecha'],
          lugar: data['lugar'],
          profesor1: data['profesor1'],
          profesor2: data['profesor2'],
          profesor3: data['profesor3'],
          suplente: data['suplente'],
          alumnos: data['alumnos'],
        };
      }));

      return tribunales;
    } catch (error) {
      console.error('Error al obtener los tribunales:', error);
      throw error;
    }
  }

  private async obtenerNombreProfesor(profesorId: string): Promise<string> {
    if (!profesorId) return 'No asignado';
    const profesorDoc = await getDoc(doc(this.db, 'Tutor', profesorId));
    return profesorDoc.exists() ? profesorDoc.data()['Nombre'] : 'No encontrado';
  }

  private async obtenerNombreAlumno(alumnoId: string): Promise<string> {
    if (!alumnoId) return 'No asignado';
    const alumnoDoc = await getDoc(doc(this.db, 'Usuario', alumnoId));
    return alumnoDoc.exists() ? alumnoDoc.data()['Nombre'] : 'No encontrado';
  }

  async obtenerProfesores(): Promise<any[]> {
    try {
      const profesoresRef = collection(this.db, 'Tutor');
      const snapshot = await getDocs(profesoresRef);
      return snapshot.docs.map(doc => ({ id: doc.id, nombre: doc.data()['Nombre'] }));
    } catch (error) {
      console.error('Error al obtener los profesores:', error);
      throw error;
    }
  }

  async crearTribunal(tribunal: any): Promise<void> {
    try {
      const tribunalesRef = collection(this.db, this.pathTribunales);
      await addDoc(tribunalesRef, {
        ...tribunal,
      });
      console.log('Tribunal creado con éxito');
    } catch (error) {
      console.error('Error al crear el tribunal:', error);
      throw error;
    }
  }

  async obtenerAlumnos(): Promise<any[]> {
    try {
      const usuariosRef = collection(this.db, 'Usuario');
      const snapshot = await getDocs(usuariosRef);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data()['Nombre'] || 'Sin nombre',
        correo: doc.data()['Correo'] || 'Sin correo',
        // Puedes añadir más campos si los necesitas
      }));
    } catch (error) {
      console.error('Error al obtener los alumnos:', error);
      throw error;
    }
  }

  // Métodos adicionales para gestionar calificaciones y entregas
  async agregarCalificacion(tribunalId: string, calificacion: any): Promise<void> {
    // Implementar lógica para agregar calificación
  }

  async agregarEntrega(tribunalId: string, entrega: any): Promise<void> {
    // Implementar lógica para agregar entrega
  }
}