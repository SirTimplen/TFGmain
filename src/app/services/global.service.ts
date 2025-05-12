import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private userTypeSubject = new BehaviorSubject<'usuario' | 'tutor' | 'tribunal' | null>(null);
  userType$ = this.userTypeSubject.asObservable();

  setUserType(type: 'usuario' | 'tutor' | 'tribunal') { 
    this.userTypeSubject.next(type);
  }

async login(email: string, password: string): Promise<'usuario' | 'tutor' | 'tribunal'> {
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
      const lineas = snapshot.docs.map((doc) => doc.data());
      return lineas;
    } catch (error) {
      console.error('Error al obtener las líneas:', error);
      throw error;
    }
  }
}