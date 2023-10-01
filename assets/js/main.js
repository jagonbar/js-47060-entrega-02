//--------------------------------------------------------------------------------
// globales

//div para mostrar tablas
const consolajs = document.getElementById("consolajs");

//elementos para crear tablas

const html ={
    "table"   : "<table extra_atributos>valor</table>",
    "td"   : "<td extra_atributos>valor</td>",
    "tr"   : "<tr extra_atributos>valor</tr>",
    "p"   : "<p extra_atributos>valor</p>",
    "img"  : "<img src=\"valor\" extra_atributos/>",
}

//guarda productos a vender
const venta = []

//muestra tabla catálogo de productos
muestraTablaProducto();

//espera la carga de catálogo y empieza la venta
setTimeout(() => {
    
        realizaVenta();
    }, 4000);
//--------------------------------------------------------------------------------
/**
 * crea tabla catálogo de productos
 */
function muestraTablaProducto(){
    console.log("function muestraTablaProducto()")
    
    let html = creaHTML("tr",
        creaHTML("td","ID PRODUCTO")+
        creaHTML("td","TITULO")+
        creaHTML("td","PRECIO")+
        creaHTML("td","DESCRIPCION")+
        creaHTML("td","IMAGEN")
    );
    
    productos.forEach((p)=>{
        html += creaHTML("tr",
                creaHTML("td",p.id)
                creaHTML("td",p.titulo)
                + creaHTML("td",p.precio)
                + creaHTML("td",p.descripcion)
                + creaHTML("td",creaHTML("img",p.imagen,[{"alt":"imagen juego"}]))
        )
    });
    console.log("antes de tabla",html)
    html = creaHTML("table",html,[{"border":"1"}]);
    console.log("despues de tabla",html)
    
    consolajs.innerHTML = html;
}
//--------------------------------------------------------------------------------
/**
 * crea elemento html
 * @param {string} tag html
 * @param {string} valor 
 * @param {string|array<json>} extra_atributos [{atributo:valor},...]
 * @returns 
 */
function creaHTML(tag, valor, extra_atributos=""){
    console.log("function creaHTML()")
    console.log(
          {tag}
        , {valor}
        , {extra_atributos}
    )
    let texto_extra_atributos="";
    let elemento = html[tag].replace("valor",valor);
    
    if(Array.isArray(extra_atributos)){
        extra_atributos.forEach(atributo=>{
            // console.log({atributo})
            for(propiedad in atributo){
                texto_extra_atributos+= `${propiedad}="${atributo[propiedad]}" `;
            }
        })
    }else{
        texto_extra_atributos=extra_atributos
    }
    elemento = elemento.replace("extra_atributos",texto_extra_atributos)
    // console.log({elemento})
    return elemento;
}
//--------------------------------------------------------------------------------
/**
 * pide producto y agrega detalle a venta
 */
function realizaVenta(){
    console.log("function realizaVenta()")
    variable = "un producto";
    while(preguntaOpcionSIoNO(`¿Quieres comprar ${variable} ?\nResponde:\nSI para comprar\nNO para finalizar compra`)){
        
        let {id,cantidad} = pedirProductoaVender();
        
        agregarDetalleVenta(id, cantidad);
        
        variable = "otro producto más";
    }
    finalizaVenta()
}
//--------------------------------------------------------------------------------
/**
 * crea tabla resumen de venta en pantalla
 */
function finalizaVenta(){
    console.log("function finalizaVenta()")

    let total_venta=0;
    //calcular total de venta
    total_venta =venta.reduce((total_venta, producto)=>total_venta+producto.total, 0);
    //crear html tabla resumen venta
    let html = creaHTML("tr",
        creaHTML("td","TITULO")+
        creaHTML("td","PRECIO")+
        creaHTML("td","CANTIDAD")+
        creaHTML("td","TOTAL")
    );

    venta.forEach((p)=>{        
        html += creaHTML("tr",
                    creaHTML("td",p.titulo),
                    creaHTML("td",p.precio),
                    creaHTML("td",p.cantidad),
                    creaHTML("td",p.total)
        );
    });
    html = creaHTML("tr",
        creaHTML("td","TOTAL",[{"colspan":3}])+
        creaHTML("td",total_venta)        
    );
    html = creaHTML("table",html,[{"border":"1"}]);
    consolajs.innerHTML = html; 
}
//--------------------------------------------------------------------------------
/**
 * pedir de producto y cantidad a vender.
 * finalmente se agrega detalle a venta
 */
function pedirProductoaVender(){        
    console.log("function pedirProductoaVender()")
        let id = pedirIdyRevisar();            
                
        let cantidad = pedirCantidad();
        return {id,cantidad}                         
}
//--------------------------------------------------------------------------------
/**
 * pedir id de producto de la lista existente
 * sigue preguntando por id si:
 * - id no existe en lista de producto
 * - se encontró que producto ya está en la venta.
 *  - en este caso se pregunta si se quiere reemplazar
 * @returns id int
 */
function pedirIdyRevisar(){
    console.log("function pedirIdyRevisar()")
    
    
    let se_encuentra_producto;
    let se_encuentra_en_venta;

    let sigue_preguntando=true
    do{
        
        //---------------------------------
        /* Pedir ID de producto*/
        let msg = `Ingresar id de producto:`
        let id = prompt(msg);
        
        //Revisar que se encuentre producto        
        se_encuentra_producto= (productos.indexOf(id)!=-1)

        //si no se encuentra cortar ciclo y pedir ID otra vez
        if(!se_encuentra_producto){
            msg=`Debe ingresar un id de la lista  de productos`;
            alert(msg)
            continue;
        }
        
        //revisar si se encuentra ya el producto pedido en la venta
        // si está preguntar si se reemplaza o pedir otro id
        se_encuentra_en_venta= (venta.indexOf(id) != -1);
        if(se_encuentra_en_venta){
            msg=`El producto ya se encuentra agregado a la venta\n
            ¿Quieres reemplazar el producto?`;
            if(preguntaOpcionSIoNO(msg)){
                sacarProductoDeVenta(id);
            }
            continue;
        }
        sigue_preguntando=false;
    }while(sigue_preguntando)
    return id;
}
//--------------------------------------------------------------------------------
/**
 * Agregar producto con detalle de cantidad a vender con total
 * @param {Int} producto 
 * @param {Int} cantidad 
 */
function agregarDetalleVenta(id_producto,cantidad){
    console.log("function agregarDetalleVenta()")
    let producto = productos.find((p)=>{p.id==id_producto});
    venta.push({
          "id": producto.id
        , "titulo": producto.titulo
        , "precio": producto.precio
        , cantidad
        , "total" : cantidad*producto.precio
    });
}
//--------------------------------------------------------------------------------
/**
 * pide cantidad a vender entre 1 a 100
 * si numero está fuera de rango, se sigue preguntando
 * @returns cantidad
 */
function pedirCantidad(){
    console.log("function pedirCantidad()")
    do{
        let cantidad= prompt("Indica cantidad a comprar (de 1 a 100) ");
        es_valido   = validaNumeroInt(cantidad) && validaRango(cantidad);
    }while(!es_valido)
    return cantidad;
}
//--------------------------------------------------------------------------------
/**
 * retorna verdadero o falso si es que cantidad esta entre 1 y 100 o no.
 * @param {int} cantidad 
 * @returns {boolean}
 */
function validaRango(cantidad){
    console.log("function validaRango()")
    let [minimo,maximo] = [1,100];
    let es_rango_valido = (minimo>=0 && cantidad<=maximo);
    if(!es_rango_valido) alert("Cantidad debe ser un rango entre 1 y 100");
    return es_rango_valido;}
//--------------------------------------------------------------------------------
function preguntaOpcionSIoNO(texto_pregunta){
    console.log("function preguntaOpcionSIoNO()")
    let validacion = true;
    do{
        let respuesta_continuar_compra = prompt(texto_pregunta);
        validacion = validaOpcion(respuesta_continuar_compra,[{"opcion":"SI","valor":true},{"opcion":"NO","valor":false}]);
    }while(validacion);
    
    return (respuesta_continuar_compra=="SI");
}
//--------------------------------------------------------------------------------
function validaOpcion(respuesta_dada,opciones_validas){
    console.log("function validaOpcion()")
    es_opcion_valida = (opciones_validas.indexOf(respuesta_dada)!=-1);
    
    let msg = `Opción no válida debe ingresar:\n${opciones_validas.join(", ")}`

    if(!es_opcion_valida) alert(msg);
    return es_opcion_valida
}
//--------------------------------------------------------------------------------
/**
 * saca producto de la venta, dejandolo al final para eliminarlo con pop
 * @param {*} id 
 */
function sacarProductoDeVenta(id){
    console.log("function sacarProductoDeVenta()")
    //buscar id de producto
    //dejarlo al final
    //sacarlo con pop
    venta.sort((producto)=>{
        return (producto.id==id)?1:0;            
    });
    venta.pop()
}
//--------------------------------------------------------------------------------
/**
 * valida si es un número entero válido
 * @param {string} valor 
 * @returns {boolean}
 */
function validaNumeroInt(valor){
    console.log("function validaNumeroInt()")
    es_valido = Number.isInteger(valor);
    if(!es_valido) alert("Ingresa un número valido");
    return es_valido;
}


//--------------------------------------------------------------------------------

// prompt("Indica id de producto a comprar")
//     //no encuentra
//     "indica un id de la tabla.\nEl id id no tiene producto asociado"
//     pregunta_reemplazar = prompt("el producto ya se encuentra agregado,¿Quieres reemplazarlo?")
//     //si    
//     prompt("cantidad")
//     alert("cantidad:c | precio:p | total:t\n\nMonto total venta hasta el momento:venta")
//     //no
// continuar_compra = prompt("¿Quieres comprar otro?\nResponde:\nSI para comprar\nNO para finalizar compra");
