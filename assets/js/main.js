const consolajs = document.getElementById("consolajs");
let venta = []
let html = "";
let td  = "<td>valor</td>"
let tr  = "<tr>valor</tr>"
let img = "<img src=\"ruta\" alt=\"cover metalgear\">"
productos.forEach((p)=>{
    let html_producto
    html_producto += td.replace("valor",p.titulo);
    html_producto += td.replace("valor",p.precio);
    html_producto += td.replace("valor",p.descripcion);    
    html_producto += td.replace("valor",(img.replace("ruta",p.imagen)))
    html += tr.replace("valor",html_producto);
});

consolajs.innerHTML = html;

setTimeout(() => {
    
        realizaVenta();
    }, 3000);
function realizaVenta(){
    variable = "un producto";
    while(preguntaOpcionSIoNO(`¿Quieres comprar ${variable} ?\nResponde:\nSI para comprar\nNO para finalizar compra`)){
        
        pedirProducto();
        
        
        variable = "otro producto más";
    }
    finalizaVenta()
}
function finalizaVenta(){

}

function pedirProducto(){        
        let id = pedirIdyRevisar();            
                
        let cantidad = pedirCantidad();

        let producto_a_comprar = productos.find((p)=>id==p.id);
         
        agregarDetalleVenta(producto_a_comprar, cantidad);    
}
function revisaSiExisteEnVenta(id){
    //aca
    let se_encuentra = venta.find((p)=>{return p.id==id});
    if(se_encuentra){

    }
}

function agregarDetalleVenta(producto,cantidad){
    venta.push({
          "id": producto.id
        , "titulo": producto.titulo
        , "precio": producto.precio
        , cantidad
        , "total" : cantidad*producto.precio
    });
}

function pedirId(){
    do{
        let id    = prompt("Indica id de producto a comprar");
        es_valido = validaNumero(id) && validaIdExista(id);
    }while(!es_valido)

    let id = revisaSiExisteEnVenta(id);
    
    return id
}
function pedirCantidad(){
    do{
        let cantidad=prompt("Indica cantidad a comprar (de 1 a 100) ");
        es_valido   = validaNumero(cantidad) &&validaRango(cantidad);
    }while(!es_valido)
    return id
}
function validaIdExista(id){    
    let se_encuentra = (!productos.indexOf(id))
    if(!se_encuentra) alert(`El id ${id} no tiene producto asociado`);
    return se_encuentra;
}
function validaRango(cantidad){    
    let es_rango_valido = (cantidad>0 && cantidad<101);
    if(!es_rango_valido) alert("Cantidad debe ser un rango entre 1 y 100");
    return es_rango_valido;
}
function sumaProducto(id,cantidad,precio){
    let p = productos.filter((p)=>id==p.id);
    let producto_a_vender = {
        "id": p[0].id,
        cantidad,
        precio,
        "total_producto":cantidad*precio
    };
    venta.push(producto_a_vender);        
}

function preguntaOpcionSIoNO(texto_pregunta){
    let validacion = true;
    do{
        let respuesta_continuar_compra = prompt(texto_pregunta);
        validacion = validaOpcion(respuesta_continuar_compra,["SI","NO"]);
    }while(validacion);
    
    return (respuesta_continuar_compra=="SI");
}

prompt("Indica id de producto a comprar")
    //no encuentra
    "indica un id de la tabla.\nEl id id no tiene producto asociado"
    pregunta_reemplazar = prompt("el producto ya se encuentra agregado,¿Quieres reemplazarlo?")
    //si    
    prompt("cantidad")
    alert("cantidad:c | precio:p | total:t\n\nMonto total venta hasta el momento:venta")
    //no
continuar_compra = prompt("¿Quieres comprar otro?\nResponde:\nSI para comprar\nNO para finalizar compra");
