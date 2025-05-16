import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { addDoc} from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private userType: 'usuario' | 'tutor' | 'tribunal' |'admin' | null = null;
  private userTypeSubject = new BehaviorSubject<'usuario' | 'tutor' | 'tribunal' |'admin' | null>(null);
  userType$ = this.userTypeSubject.asObservable();

  setUserType(type: 'usuario' | 'tutor' | 'tribunal'|'admin' ) { 
    this.userTypeSubject.next(type);
  }

async login(email: string, password: string): Promise<'usuario' | 'tutor' | 'tribunal'|'admin' > {
  const auth = getAuth();
  const db = getFirestore();

  try {
    console.log('Iniciando sesión con:', email, password);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Autenticación exitosa:', userCredential);

    const usuarioQuery = query(collection(db, 'Usuario'), where('Correo', '==', email), where('Contraseña', '==', password));
    const tutorQuery = query(collection(db, 'Tutor'), where('Correo', '==', email), where('Contraseña', '==', password));

    const usuarioSnapshot = await getDocs(usuarioQuery);
    if (!usuarioSnapshot.empty) {
      console.log('Usuario encontrado en la colección Usuario');
      this.setUserType('usuario');
      return 'usuario';
    }

    const tutorSnapshot = await getDocs(tutorQuery);
    if (!tutorSnapshot.empty) {
      const tutorData = tutorSnapshot.docs[0].data();
      console.log('Tutor encontrado:', tutorData);
      if (tutorData['Tribunal'] && tutorData['Tribunal'] !== '0') {
        this.setUserType('tribunal');
        return 'tribunal';
      } else {
        this.setUserType('tutor');
        return 'tutor';
      }
    }

    throw new Error('Usuario no encontrado en Firestore');
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

  async logout(): Promise<void> {
    const auth = getAuth();
    await signOut(auth);
    this.userTypeSubject.next(null);
  }
  private db = getFirestore();
  async obtenerLineas(): Promise<any[]> {
  try {
    const lineasRef = collection(this.db, 'Linea');
    const snapshot = await getDocs(lineasRef);

    // Mapea los datos y asegúrate de que todos los campos estén presentes
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // Incluye el ID del documento
        titulo: data['titulo'] || 'Sin título',
        ambito: data['ambito'] || 'Sin ámbito',
        descripcion: data['descripcion'] || 'Sin descripción',
        plazasLibres: data['plazasLibres'] || 0,
        plazasOriginal: data['plazasOriginal'] || 0,
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

    const solicitudesRef = collection(this.db, 'Solicitud');
    const usuarioQuery = query(solicitudesRef, where('usuario', '==', userEmail)); // Filtra por el correo del usuario
    const snapshot = await getDocs(usuarioQuery);

    const solicitudes = await Promise.all(
      snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();

        // Obtén el nombre de la línea
        const lineaDoc = await getDoc(doc(this.db, 'Linea', data['linea']));
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
getUserType(): 'usuario' | 'tutor' | 'tribunal' |'admin' | null {
    return this.userTypeSubject.getValue();
  }
async crearLinea(linea: any, tutorEmail: string): Promise<void> {
  try {
    const lineasRef = collection(this.db, 'Linea');
    // Asegura que los campos sean number
    const plazasLibres = Number(linea.plazasLibres);
    const plazasOriginal = Number(linea.plazasOriginal ?? linea.plazasLibres);

    await addDoc(lineasRef, {
      ...linea,
      tutor: tutorEmail,
      plazasLibres,
      plazasOriginal,
    });
    console.log('Línea creada con éxito');
  } catch (error) {
    console.error('Error al crear la línea:', error);
    throw error;
  }
}
async obtenerLineasPorTutor(tutorId: string): Promise<any[]> {
  try {
    const lineasRef = collection(this.db, 'Linea');
    const tutorQuery = query(lineasRef, where('tutor', '==', tutorId)); // Filtra por la ID del tutor
    const snapshot = await getDocs(tutorQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Incluye el ID del documento
  } catch (error) {
    console.error('Error al obtener las líneas del tutor:', error);
    throw error;
  }
}
async actualizarLinea(lineaId: string, linea: any): Promise<void> {
  try {
    const lineaRef = doc(this.db, 'Linea', lineaId);
    // Fuerza los campos a number antes de actualizar
    if (linea.plazasLibres !== undefined) {
      linea.plazasLibres = Number(linea.plazasLibres);
    }
    if (linea.plazasOriginal !== undefined) {
      linea.plazasOriginal = Number(linea.plazasOriginal);
    }
    await updateDoc(lineaRef, linea);
    console.log('Línea actualizada con éxito');
  } catch (error) {
    console.error('Error al actualizar la línea:', error);
    throw error;
  }
}

async getUserEmail(): Promise<string | null> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return user.email;
  } else {
    console.error('No hay usuario autenticado');
    return null;
  }
}
async obtenerSolicitudesPorTutor(tutorEmail: string): Promise<any[]> {
  try {
    const solicitudesRef = collection(this.db, 'Solicitud');
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
        const lineaDoc = await getDoc(doc(this.db, 'Linea', data['linea']));
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
    const solicitudRef = doc(this.db, 'Solicitud', solicitudId);
    const solicitudSnapshot = await getDoc(solicitudRef);
    if (!solicitudSnapshot.exists()) {
      throw new Error('Solicitud no encontrada');
    }

    const solicitudData = solicitudSnapshot.data();
    const lineaRef = doc(this.db, 'Linea', solicitudData['linea']);
    const lineaSnapshot = await getDoc(lineaRef);

    if (!lineaSnapshot.exists()) {
      throw new Error('Línea no encontrada');
    }

    const lineaData = lineaSnapshot.data();
    let plazasLibres = lineaData['plazasLibres'];

    if (estado === 'Aceptada' && solicitudData['estado'] !== 'Aceptada') {
      if (plazasLibres > 0) {
        plazasLibres -= 1;
      } else {
        throw new Error('No hay plazas disponibles');
      }
    } else if (estado === 'Rechazada' && solicitudData['estado'] === 'Aceptada') {
      plazasLibres += 1;
    }

    // Actualiza el estado de la solicitud
    await updateDoc(solicitudRef, { estado });

    // Actualiza las plazas libres de la línea
    await updateDoc(lineaRef, { plazasLibres });

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

    const lineaRef = doc(this.db, 'Linea', lineaId);
    const lineaSnapshot = await getDoc(lineaRef);

    if (!lineaSnapshot.exists()) {
      throw new Error('Línea no encontrada');
    }

    const lineaData = lineaSnapshot.data();
    if (lineaData['plazasLibres'] <= 0) {
      throw new Error('No hay plazas disponibles para esta línea');
    }

    const solicitudesRef = collection(this.db, 'Solicitud');
    const usuarioQuery = query(
      solicitudesRef,
      where('usuario', '==', userEmail),
      where('estado', 'in', ['Pendiente', 'Aceptada'])
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
// ...existing code...

async borrarLinea(lineaId: string): Promise<void> {
  try {
    const lineaRef = doc(this.db, 'Linea', lineaId);
    await deleteDoc(lineaRef);
    console.log('Línea borrada con éxito');
  } catch (error) {
    console.error('Error al borrar la línea:', error);
    throw error;
  }
}
}