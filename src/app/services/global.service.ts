import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import { deleteObject } from "firebase/storage";
import { arrayUnion,deleteField } from 'firebase/firestore'; // Añade esta importación si quieres usar arrays

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private carrera: string = 'ingenieria_informatica';
  private convocatoria: string = 'convocatoria_junio';

  // Los paths ahora usan las variables dinámicas
  get pathLineas() {
    return `/${this.carrera}/grado2024-2025/linea`;
  }
  get pathSolicitudes() {
    return `/${this.carrera}/grado2024-2025/solicitud`;
  }
  get pathTribunales() {
    return `/${this.carrera}/grado2024-2025/convocatorias/${this.convocatoria}/tribunales`;
  }
  get pathEntregas() {
    return `/${this.carrera}/grado2024-2025/convocatorias/${this.convocatoria}/entregas`;
  }

 setCarrera(carrera: string) {
  this.carrera = carrera;
  localStorage.setItem('selectedCarrera', carrera);
}
setConvocatoria(convocatoria: string) {
  this.convocatoria = convocatoria;
  localStorage.setItem('selectedConvocatoria', convocatoria);
}
  private userTypeSubject = new BehaviorSubject<'usuario' | 'tutor' | 'admin' | null>(null);
  userType$ = this.userTypeSubject.asObservable();

  constructor() {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Persistencia configurada correctamente
        const userType = localStorage.getItem('userType') as 'usuario' | 'tutor' | 'admin' | null;
        if (userType) {
          this.userTypeSubject.next(userType);
        }
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');

        if (email && password) {
          // Si hay un email guardado, significa que el usuario ya ha iniciado sesión
          signInWithEmailAndPassword(auth, email,password || '')
            .then(() => {
              console.log('Usuario autenticado automáticamente');
            })
            .catch((error) => {
              console.error('Error al autenticar automáticamente:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error al establecer la persistencia de sesión:', error);
      });
      const storedCarrera = localStorage.getItem('selectedCarrera');
  const storedConvocatoria = localStorage.getItem('selectedConvocatoria');
  if (storedCarrera) this.carrera = storedCarrera;
  if (storedConvocatoria) this.convocatoria = storedConvocatoria;
  }

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
      localStorage.setItem('password', password); // Guardar la contraseña (no recomendado en producción)
      return userType;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
  async getCurrentUserData(): Promise<any> {
    // Implementa aquí la lógica para obtener el usuario autenticado de Firestore
    const auth = getAuth();
    const user = auth.currentUser;
    const useremail= localStorage.getItem('email');
    if (user) {
      const db = getFirestore();
      const userRef = doc(db, 'Usuario', useremail || user.uid); // Usa el email o uid del usuario autenticado
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.error('No se encontró el documento del usuario');
        return null;
      }
    } else {
      console.error('No hay un usuario autenticado');
      return null;
    }
  }
  setUserType(type: 'usuario' | 'tutor' | 'admin') {
    this.userTypeSubject.next(type);
  }
  getpassword(): string | null {
    return localStorage.getItem('password');
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
      const plazasLibres = plazasOriginal; // Inicialmente todas las plazas están libres
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
 async getUserId(): Promise<string | null> {
  const userEmail = await this.getUserEmail();
  if (!userEmail) {
    return null;
  }
  const userRef = query(collection(this.db, 'Usuario'), where('Correo', '==', userEmail));
  const userSnapshot = await getDocs(userRef);
  if (!userSnapshot.empty) {
    return userSnapshot.docs[0].id;
  }
  return null;
 }
 async getTutorId(): Promise<string | null> {
  const userEmail = await this.getUserEmail();
  if (!userEmail) {
    return null;
  }
  const tutorRef = query(collection(this.db, 'Tutor'), where('Correo', '==', userEmail));
  const tutorSnapshot = await getDocs(tutorRef);
  if (!tutorSnapshot.empty) {
    return tutorSnapshot.docs[0].id;
  }
  return null;
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
      const presidente = await this.obtenerNombreProfesor(data['presidente']);
      const secretario = await this.obtenerNombreProfesor(data['secretario']);
      const vocal = await this.obtenerNombreProfesor(data['vocal']);
      const suplente = await this.obtenerNombreProfesor(data['suplente']);

      return {
        id: doc.id,
        presidente: presidente,
        secretario: secretario,
        vocal: vocal,
        suplente: suplente,
      };
    }));

    return tribunales;
  } catch (error) {
    console.error('Error al obtener los tribunales:', error);
    throw error;
  }
}

  async obtenerNombreProfesor(profesorId: string): Promise<string> {
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
      return snapshot.docs.map(doc => ({ id: doc.id, correo: doc.data()['Correo'] }));
    } catch (error) {
      console.error('Error al obtener los profesores:', error);
      throw error;
    }
  }
async crearTribunal(tribunal: any): Promise<void> {
  try {
    const tribunalesRef = collection(this.db, this.pathTribunales);

    // Si hay varios alumnos, crea un tribunal por cada uno, separando la hora 45 minutos
    

        // Crea el tribunal (sin alumnos)
        const tribunalDocRef = await addDoc(tribunalesRef, {
          presidente: tribunal.profesor1,
          secretario: tribunal.profesor2,
          vocal: tribunal.profesor3,
          suplente: tribunal.suplente
        });
if (Array.isArray(tribunal.alumnos) && tribunal.alumnos.length > 0) {
      let baseDate = new Date(tribunal.fecha);
      for (let i = 0; i < tribunal.alumnos.length; i++) {
        const alumnoId = tribunal.alumnos[i];
        const fechaTribunal = new Date(baseDate.getTime() + i * 45 * 60000); // 45 minutos por alumno
        // Crea la defensa en la subcolección defensas
        const defensasRef = collection(tribunalDocRef, 'defensas');
        await addDoc(defensasRef, {
          alumno: alumnoId,
          fecha: fechaTribunal.toISOString(),
          lugar: tribunal.lugar
        });
      }
    } else {
      // Solo un alumno
      const tribunalDocRef = await addDoc(tribunalesRef, {
        presidente: tribunal.profesor1,
        secretario: tribunal.profesor2,
        vocal: tribunal.profesor3,
        suplente: tribunal.suplente
      });
      const defensasRef = collection(tribunalDocRef, 'defensas');
      await addDoc(defensasRef, {
        alumno: tribunal.alumnos ? tribunal.alumnos[0] : null,
        calificaciones: {
          presidente: null,
          secretario: null,
          vocal: null,
          tutor: null
        },
        fecha: tribunal.fecha,
        lugar: tribunal.lugar
      });
    }
    console.log('Tribunal(es) y defensa(s) creados con éxito');
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
// Subir entrega TFG
async subirEntregaTFG(archivo: File): Promise<void> {
  const userId = await this.getUserId();
  if (!userId) throw new Error('Usuario no autenticado');
  const storage = getStorage();
  //guardar el archivo nombre de usuario+ nombre de archivo
  const userEmail = await this.getUserEmail();
  if (!userEmail) throw new Error('No se pudo obtener el correo del usuario');
  const nombreArchivo = `${userEmail}_${archivo.name}`;

  const storageRef = ref(storage, `entregas-tfg/${nombreArchivo}`);
  const snapshot = await uploadBytes(storageRef, archivo);
  const url = await getDownloadURL(snapshot.ref);

  // Guarda la entrega en la colección entregas
  const entregasRef = collection(this.db, this.pathEntregas);
  // Si ya existe, actualiza; si no, crea
  const q = query(entregasRef, where('usuarioId', '==', userId));
  const snap = await getDocs(q);
  if (!snap.empty) {
    // Actualiza
    await updateDoc(snap.docs[0].ref, {
      archivoUrl: url,
      fechaEntrega: new Date().toISOString()
    });
  } else {
    // Crea
    await addDoc(entregasRef, {
      usuarioId: userId,
      archivoUrl: url,
      fechaEntrega: new Date().toISOString()
    });
  }
}

// Obtener entrega del usuario
async obtenerEntregaUsuario(): Promise<any | null> {
  const userId = await this.getUserId();
  if (!userId) return null;
  const entregasRef = collection(this.db, this.pathEntregas);
  const q = query(entregasRef, where('usuarioId', '==', userId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

// Borrar entrega del usuario
async borrarEntregaUsuario(entrega: any): Promise<void> {
  // Borra archivo de Storage
  const storage = getStorage();
  const archivoRef = ref(storage, entrega.archivoUrl);
  await deleteObject(archivoRef);

  // Borra documento de Firestore
  const entregaRef = doc(this.db, this.pathEntregas, entrega.id);
  await deleteDoc(entregaRef);
}

async borrarTribunal(tribunalId: string): Promise<void> {
  try {
    const tribunalRef = doc(this.db, this.pathTribunales, tribunalId);
    await deleteDoc(tribunalRef);
    console.log('Tribunal borrado con éxito');
  } catch (error) {
    console.error('Error al borrar el tribunal:', error);
    throw error;
  }
}
async obtenerTribunalesPorTutor(tutorId: string): Promise<any[]> {
  try {
    const tribunalesRef = collection(this.db, this.pathTribunales);

    // Haz una consulta por cada puesto
    const queries = [
      query(tribunalesRef, where('presidente', '==', tutorId)),
      query(tribunalesRef, where('secretario', '==', tutorId)),
      query(tribunalesRef, where('vocal', '==', tutorId)),
      query(tribunalesRef, where('suplente', '==', tutorId)),
    ];

    // Ejecuta todas las consultas y combina los resultados
    const snapshots = await Promise.all(queries.map(q => getDocs(q)));
    const docsMap = new Map();

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        if (!docsMap.has(doc.id)) {
          docsMap.set(doc.id, doc);
        }
      }
    }

    // Procesa los tribunales únicos
    const tribunales = await Promise.all(Array.from(docsMap.values()).map(async (doc) => {
      const data = doc.data();
      const presidente = await this.obtenerNombreProfesor(data['presidente']);
      const secretario = await this.obtenerNombreProfesor(data['secretario']);
      const vocal = await this.obtenerNombreProfesor(data['vocal']);
      const suplente = await this.obtenerNombreProfesor(data['suplente']);

      return {
        id: doc.id,
        presidente,
        secretario,
        vocal,
        suplente,
      };
    }));

    return tribunales;
  } catch (error) {
    console.error('Error al obtener los tribunales por tutor:', error);
    throw error;
  }
}

async obtenerDefensasConNombres(tribunalId: string): Promise<any[]> {
  try {
    const defensasRef = collection(this.db, `${this.pathTribunales}/${tribunalId}/defensas`);
    const snapshot = await getDocs(defensasRef);

    // Obtén el puesto del usuario actual
    const userId = await this.getTutorId();
    let puesto = '';
    const tribunalDoc = await getDoc(doc(this.db, this.pathTribunales, tribunalId));
    if (tribunalDoc.exists()) {
      const t = tribunalDoc.data();
      const userName = await this.obtenerNombreProfesor(userId!);
      if (t['presidente'] && (await this.obtenerNombreProfesor(t['presidente'])) === userName) puesto = 'presidente';
      else if (t['secretario'] && (await this.obtenerNombreProfesor(t['secretario'])) === userName) puesto = 'secretario';
      else if (t['vocal'] && (await this.obtenerNombreProfesor(t['vocal'])) === userName) puesto = 'vocal';
      else if (t['suplente'] && (await this.obtenerNombreProfesor(t['suplente'])) === userName) puesto = 'suplente';
      else puesto = 'tutor';
    }

    const defensas = await Promise.all(snapshot.docs.map(async (docDef) => {
      const data = docDef.data();
      const alumnoId = data['alumno'];
      const alumnoNombre = await this.obtenerNombreAlumno(alumnoId);

      // Busca la entrega del alumno para mostrar la nota de este puesto
      let nota = null;
      const entregasRef = collection(this.db, this.pathEntregas);
      const q = query(entregasRef, where('usuarioId', '==', alumnoId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const entregaData = snap.docs[0].data();
        nota = entregaData[puesto] ?? null;
      }

      return {
        id: docDef.id,
        alumno: alumnoNombre,
        alumnoId: alumnoId,
        fecha: data['fecha'],
        lugar: data['lugar'],
        calificaciones: data['calificaciones'] || {},
        nota: nota,
        puesto: puesto
      };
    }));

    return defensas;
  } catch (error) {
    console.error('Error al obtener las defensas con nombres:', error);
    throw error;
  }
}
async guardarCalificacionEnEntrega(usuarioId: string, puesto: string, media: number) {
  const entregasRef = collection(this.db, this.pathEntregas);
  const q = query(entregasRef, where('usuarioId', '==', usuarioId));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const entregaRef = snap.docs[0].ref;
    await updateDoc(entregaRef, {
      [puesto]: media
    });
  }
  
}
async obtenerSolicitudesAsignadasTutor(tutorEmail: string): Promise<any[]> {
  const solicitudesRef = collection(this.db, this.pathSolicitudes);
  const q = query(
    solicitudesRef,
    where('tutor', '==', tutorEmail),
    where('asignacion', '==', true)
  );
  const snapshot = await getDocs(q);
  return Promise.all(snapshot.docs.map(async docSnap => {
    const data = docSnap.data();
    // 1. Busca el ID real del alumno a partir del correo
    const usuarioQuery = query(collection(this.db, 'Usuario'), where('Correo', '==', data['usuario']));
    const usuarioSnap = await getDocs(usuarioQuery);
    let alumnoId = null;
    let alumnoNombre = '';
    if (!usuarioSnap.empty) {
      alumnoId = usuarioSnap.docs[0].id;
      alumnoNombre = usuarioSnap.docs[0].data()['Nombre'] || '';
    }
    // 2. Busca la entrega por el ID real del alumno
    let entrega = null;
    if (alumnoId) {
      const entregasRef = collection(this.db, this.pathEntregas);
      const qEntrega = query(entregasRef, where('usuarioId', '==', alumnoId));
      const snapEntrega = await getDocs(qEntrega);
      if (!snapEntrega.empty) {
        entrega = { id: snapEntrega.docs[0].id, ...snapEntrega.docs[0].data() };
      }
    }
    return {
      id: docSnap.id,
      alumnoId,
      alumnoNombre,
      entrega
    };
  }));
}

}