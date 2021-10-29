import { PersistentSet, PersistentUnorderedMap, PersistentVector, Context} from "near-sdk-as";


export class Deuda{

   tipo: string
   jugador: Jugador;
   cantidad: f64;
    saldado:boolean

  constructor(jugador: Jugador,cantidad:f64,tipo:string){
    this.jugador=jugador
    this.cantidad=cantidad
    this.saldado=false
    this.tipo=tipo
  }

  imprimirDeuda():string{
 
    return `{Persona:${this.jugador.toDeuda(this.tipo)},Cantidad:${this.cantidad}`
    
    
  }

}


  export class Solicitud{
    tipo: string
    jugador: Jugador
    cantidad: f64
    interes: f64


    constructor(tipo:string,jugador: Jugador,cantidad:f64,interes:f64){
      this.tipo=tipo
      this.jugador=jugador
      this.cantidad=cantidad
      this.interes=interes
    }

    toString(): string{
      return `{tipo:${this.tipo},jugador:${this.jugador.toString()},cantidad${this.cantidad},interes:${this.interes}}`
    }



  }

  export class Jugador{
     nombreJ: string;
     idNear: string;
     fondos: f64;
     transacciones: PersistentUnorderedMap<string,f64>;
     adeudos: PersistentVector<Deuda>;
     deudores: PersistentVector<Deuda>;
     historial: PersistentVector<Apuesta>;
     verificado: boolean;
     deuda: f64;
     adeudo: f64;
     prestamos: boolean;
     requests: PersistentUnorderedMap<string,Solicitud>;
    constructor(nombreJ:string,idNear:string,prestamo:boolean){
        this.nombreJ=nombreJ
        this.idNear=idNear
        this.adeudos=new PersistentVector<Deuda>(idNear+"a")
        this.deudores=new PersistentVector<Deuda>(idNear+"d")
        this.historial=new PersistentVector<Apuesta>("h")
        this.transacciones=new PersistentUnorderedMap<string,f64>("t")
        this.prestamos=prestamo
        this.verificado=false
        this.requests=new PersistentUnorderedMap<string,Solicitud>("r")
    }

    toDeuda(tipo:string):string{


        if (tipo==="adeudo") {
            return `{nombreJ:${this.nombreJ},idNear:${this.idNear},verificado:${this.verificado},fondos:${this.fondos},adeudos:${this.adeudo}}`
        }
        else{
            return `{nombreJ:${this.nombreJ},idNear:${this.idNear},verificado:${this.verificado},fondos:${this.fondos},deudores:${this.deuda}}`
        }
    }

    toString():string{
        return `{nombreJ:${this.nombreJ},idNear:${this.idNear},verificado:${this.verificado},fondos:${this.fondos}}`

    }   
}
export class Apuesta{
    entrada: f64
    jugador: string
    tipo: string
    resultado: string
    

  constructor(entrada: f64,jugador:string ,tipo: string,resultado:string){
    this.entrada=entrada
    this.jugador=jugador
    this.tipo=tipo
    this.resultado=resultado
  }
  apuestaToString(): string{
    return `{entrada:${this.entrada},jugadores:${this.jugador},tipo:${this.tipo},resultado:${this.resultado}}`
  }
}

export let  jugadorRegistry= new PersistentUnorderedMap<string,Jugador>("j");
export let  apuestasRegistry=new PersistentVector<Apuesta>("a");