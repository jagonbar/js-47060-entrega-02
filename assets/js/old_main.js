/*************************************************************************** */ 
const interes = 0.10;
const planAmortizacion=[];
let planAmortizacionTxt="";
/*************************************************************************** */ 
/*Eventos iniciales*/
let montoVenta=0
let numeroCuotas=0
do{
montoVenta=prompt("Ingresa el monto de venta(max 99.999.999)");

valida=f_validaMontoVenta(montoVenta);
    if(!valida){
        alert("Ingresa un número válido para monto de venta (min 1000 ,max 99.999.999)");
    }

}while(!valida);

do{
    numeroCuotas=prompt("Ingresa numero de cuotas (max 120)");
    
    valida=f_validaNumeroCuota(numeroCuotas);
        if(!valida){
            alert("Ingresa un número de cuotas valido.");
        }
    
    }while(!valida);

    montoVenta   = parseInt(montoVenta);
    numeroCuotas = parseInt(numeroCuotas);

    f_planAmortizacion(montoVenta,numeroCuotas);
    f_imprimirPlan();

/*************************************************************************** */ 
/*cálculos*/
function f_validaNumeroEntero(n){
    return (n!=NaN && n!="" && n != undefined && n>=0 && n<=99999999);
}

function f_validaMontoVenta(n){
    return (f_validaNumeroEntero(n) && n>=1000);
}
function f_validaNumeroCuota(n){
    return (f_validaNumeroEntero(n) && n>=1 && n<=120);
}
function f_calculaCuota(montoVenta, numeroCuotas){
    return montoVenta * (Math.pow(1+interes,numeroCuotas)*interes )/(Math.pow(1+interes,numeroCuotas)-1)    
};

function f_agregaCuota(numeroCuota, montoCuota,montoAmortizado,montoInteres,saldoInicial,saldoFinal){
    

    montoCuota     = montoCuota.toLocaleString() ;
    montoAmortizado=montoAmortizado.toLocaleString();
    montoInteres   =montoInteres.toLocaleString();
    saldoInicial   =saldoInicial.toLocaleString();
    saldoFinal     =saldoFinal.toLocaleString();
    
    let cuota ={
        numeroCuota
        , montoCuota
        , montoAmortizado
        , montoInteres
        , saldoInicial
        , saldoFinal
    };
    planAmortizacion[numeroCuota] = cuota;    
    
    planAmortizacionTxt += f_imprimeValor(numeroCuota)+"|"+f_imprimeValor(montoCuota)+"|"+f_imprimeValor(montoAmortizado)+"|"+f_imprimeValor(montoInteres)+"|"+f_imprimeValor(saldoInicial)+"|"+f_imprimeValor(saldoFinal)+"|\n"
};
function f_planAmortizacion (montoVenta,numeroCuotas){
    let montoCuota = Math.round(f_calculaCuota(montoVenta, numeroCuotas),0);        
    let saldoInicial    = montoVenta;        

    for(let numeroCuota=0;numeroCuota<=numeroCuotas; ++numeroCuota){
        
        if(numeroCuota==0){
            f_agregaCuota(0,0,0,0,0,saldoInicial );
            continue;
        }

        let montoInteres    =Math.floor(saldoInicial*interes,0);
        let montoAmortizado =montoCuota-montoInteres;        
        let saldoFinal      =saldoInicial-montoAmortizado;        

        if(numeroCuota==numeroCuotas){saldoFinal=0}

        f_agregaCuota(numeroCuota, montoCuota,montoAmortizado,montoInteres,saldoInicial,saldoFinal);
        
        saldoInicial    =saldoFinal;
    }   

};

function f_imprimirPlan(){    
    
    console.log("%cplan de cuotas con array", "color:red; font-size:50px");
    console.table(planAmortizacion);
    
    html=`<table>
    <tr>
    <th>número cuota</th>
    <th>Cuota(pesos)</th>
    <th>Amortización(pesos)</th>
    <th>Interes(pesos)</th>
    <th>Saldo Inicial(pesos)</th>
    <th>Saldo Final(pesos)</th>
    </tr>`

    for(let lineaPlan of planAmortizacion){
        
        html+="<tr>"
        
        for(let prop in lineaPlan){
            html+="<td>"+lineaPlan[prop]+"</td>";        
        }
        
        html+="</tr>"
    }

    html+="</table>"
    
    
    document.querySelector("#resultado").innerHTML= html; 

    planAmortizacionTxt= f_imprimeValor('n')+"|"+f_imprimeValor('cuota')+"|"+f_imprimeValor('amortizacion')+"|"+f_imprimeValor('interes')+"|"+f_imprimeValor('saldo_inicial')+"|"+f_imprimeValor('saldo_final')+"|\n"+ planAmortizacionTxt;
    
    console.log("%cplan de cuotas con solo manejo de strings", "color:red; font-size:50px");
    console.log(planAmortizacionTxt)
}

function f_imprimeValor(v){
    let valorText= v.toString();
    
    let largo    = valorText.length;
    let text     =  '____________________'
    r = text+valorText;
    r = r.substring(largo);    
    return r;
}
/*************************************************************************** */ 
/*test*/
// f_planAmortizacion(1000000,6);
// f_imprimirPlan();
