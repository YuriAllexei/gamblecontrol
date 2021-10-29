/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */
import { Context, logging, storage } from 'near-sdk-as'
import {Apuesta,apuestasRegistry,jugadorRegistry,Jugador,Deuda, Solicitud} from './model';


export function setState(nombre:string,nearID:string,prestamo:boolean): string{

  if (jugadorRegistry.contains(nearID)) {
    return `Ya hay una cuenta asociada a: ${nearID}`
  }
  else{
    const jugador=new Jugador(nombre,nearID,prestamo)
    
    logging.log(jugador.toString())
    
    jugadorRegistry.set(nearID,jugador)
    return `Se he creado el jugador ${nombre} con ID: ${nearID}
    El cual ${prestamo? "sí" : "no"} acepta prestamos si quiere hacer depósitos a su cuenta verifíquela. `
  }
}


export function solicitarPrestamo(idPrestatario:string,cantidad:f64): string {
  const idPrestamista=Context.sender
  if (jugadorRegistry.contains(idPrestamista) && jugadorRegistry.contains(idPrestatario) && idPrestatario!=idPrestamista) {
    const prestamista= jugadorRegistry.get(idPrestamista)
    const prestatario= jugadorRegistry.get(idPrestatario)
    

    if (prestamista==null || prestatario==null) {
      return `vacio`
    }


    prestamista.requests.set(idPrestatario,new Solicitud("Adeudo",prestatario,cantidad,0.07))
    prestatario.requests.set(idPrestamista,new Solicitud("Deuda",prestamista,cantidad,0.07))

    jugadorRegistry.set(idPrestamista,prestamista)
    jugadorRegistry.set(idPrestatario,prestatario)

    return "Solicitud de préstamo enviada"
  }
  
  else{
    return "Solicitud de prestamo fracasada. Revise los ID's de near de nuevo."
  }
}



// export  function  verSolicitudes() {
//   const nearID = Context.sender;

//   if (jugadorRegistry.contains(nearID)) {
//     const manejador=jugadorRegistry.get(nearID)
//     manejador.requests.forEach((value: Solicitud, key: string) => {
//       const solicitante=value.jugador
//       const cantidad=value.cantidad
//       const tipo=value.tipo
//       const interes=value.interes
//       const idSolicitante=solicitante.idNear
//       if (tipo==="Adeudo"){
//         logging.log(`Solicitud de prestamo de el usuario con ID ${idSolicitante} está pidiendo un préstamo por la cantidad de ${cantidad} con un interes del ${interes}`)
//       }
//       else{
//         logging.log(`Solicitud de prestamo al jugador con ID ${idSolicitante} por una cantidad de ${cantidad} con un interes del ${interes}`)
//       }
//     })
//   }
// }



export  function aceptarSolicitudes(idAjena:string,aceptar:boolean) : string{
  const idPropia=Context.sender
  const decide=jugadorRegistry.get(idPropia)

  const depende=jugadorRegistry.get(idPropia)
  if (decide==null || depende==null) {
    return "Jugador no encontrado"
  }
  const solicitud=decide.requests.get(idAjena)
  if (solicitud==null) {
    return "No tienes solicitudes de ningun tipo."
  }
  if (aceptar) {
    if (solicitud.tipo=="Adeudo") {
      const deuda=solicitud.cantidad*(1+solicitud.interes)
      //Deposito de near nivel 2
      
      decide.adeudos.push(new Deuda(depende,deuda,"Adeudo"))
      decide.fondos-=deuda
      decide.transacciones.set("OtorgoPrestamo",deuda)
      depende.deudores.push(new Deuda(decide,deuda,"Deuda"))
      depende.fondos+=deuda
      depende.transacciones.set("RecibioPrestamo",deuda)
      decide.requests.delete(idAjena)
      depende.requests.delete(idPropia)
      jugadorRegistry.set(idPropia,decide)
      jugadorRegistry.set(depende.idNear,depende)

      return "Se ha aceptado la deuda. Revisa tu cartera."
    } else {
      return "Solamente se pueden aceptar las solicituded de prestamo ajenas"
    }
  }
  else{
      decide.requests.delete(idAjena)
      depende.requests.delete(idPropia)
      jugadorRegistry.set(idPropia,decide)
      jugadorRegistry.set(depende.idNear,depende)
    return "El jugador no ha aceptado tu solicitud de prestamo"
  }
}

export function setApuesta(entrada:f64,idNear:string,tipo:string,resultado:string) : string{
  if (jugadorRegistry.contains(idNear)) {
    const actual=jugadorRegistry.get(idNear)
    if (actual==null) {
      return "Jugador no encontrado"
    }
    actual.fondos-=entrada
    const ap=new Apuesta(entrada,idNear,tipo,resultado)
    actual.historial.push(ap)
    jugadorRegistry.set(idNear,actual)
    apuestasRegistry.push(ap)

    return `Apuesta registrada exitosamente ${ap.apuestaToString()}`
  }
else{
  return `El jugador no fue encontrado`
  }
}
