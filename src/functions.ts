import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore'

export const signInGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()
  await signInWithRedirect(auth, provider)
}

export const hydratePiniaFromFirestore = async (pinia: any) => {
  const db = getFirestore()
  const docRef = collection(db, 'users', pinia.user.email, "data")
  const docSnap = await getDocs(docRef)

  if (!docSnap.empty) {
    const returnData = docSnap.docs.map(doc => doc.data())
    const returnDataArray = returnData.map(item => Object.values(item)[0])
    pinia.data = returnDataArray
  } else {
    await setDoc(doc(db, 'users', pinia.user.email), { init: "_" })
  }
}

export const updateFirestore = async (pinia: any) => {
  const db = getFirestore()
  for (let i = 0; i < pinia.data.length; i++) {
    const docRef = doc(db, 'users', pinia.user.email, 'data', i.toString())
    await setDoc(docRef, { data: pinia.data[i] })
  }
}

export const errorHandler = (error: string) => {
  console.log(error)
  switch (error) {
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/user-disabled':
      return 'User has been disabled'
    case 'auth/user-not-found':
      return 'User not found'
    case 'auth/wrong-password':
      return 'Wrong password'
    case 'auth/internal-error':
      return 'Internal error'
    case 'auth/email-already-in-use':
      return 'Email address is already in use'
    case 'auth/weak-password':
      return 'Password is too weak'
    default:
      return 'Unknown error'
  }
}

export const targetOptions = [
  {
    label: "A+",
    key: "A+"
  },
  {
    label: "A",
    key: "A"
  },
  {
    label: "A-",
    key: "A-"
  },
  {
    label: "B+",
    key: "B+"
  },
  {
    label: "B",
    key: "B"
  },
  {
    label: "B-",
    key: "B-"
  },
  {
    label: "C+",
    key: "C+"
  },
  {
    label: "C",
    key: "C"
  },
  {
    label: "D",
    key: "D"
  }
]

export const returnGrade = (grade: string, pinia: any) => {
  if (grade === "A+") {
    return pinia.scale.Ap
  } else if (grade === "A") {
    return pinia.scale.A
  } else if (grade === "A-") {
    return pinia.scale.Am
  } else if (grade === "B+") {
    return pinia.scale.Bp
  } else if (grade === "B") {
    return pinia.scale.B
  } else if (grade === "B-") {
    return pinia.scale.Bm
  } else if (grade === "C+") {
    return pinia.scale.C
  } else if (grade === "C") {
    return pinia.scale.C
  } else if (grade === "D") {
    return pinia.scale.D
  } else {
    return 80
  }
}