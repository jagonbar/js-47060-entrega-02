//--------------------------------------------------------------------------------
//INICIO
// globales

//div para mostrar tablas
const consolajs = document.getElementById("consolajs");
const titulo1   = document.getElementById("titulo1");
const titulo2   = document.getElementById("titulo2");

//elementos para crear tablas
const html ={
    "table"   : "<table extra_atributos>valor</table>",
    "td"   : "<td extra_atributos>valor</td>",
    "th"   : "<th extra_atributos>valor</th>",
    "tr"   : "<tr extra_atributos>valor</tr>",
    "p"   : "<p extra_atributos>valor</p>",
    "img"  : "<img src=\"valor\" extra_atributos/>",
}

//guarda productos a vender
const venta = []

//muestra tabla catálogo de productos
muestraTablaProducto();
//--------------------------------------------------------------------------------
/**
 * crea tabla catálogo de productos
 */
function muestraTablaProducto(){
    console.log("function muestraTablaProducto()")
    
    let html = creaHTML("tr",
        creaHTML("th","ID PRODUCTO",[{"class":"thIDPRODUCTO"}])+
        creaHTML("th","TITULO"     ,[{"class":"thTITULO"}])+
        creaHTML("th","PRECIO"     ,[{"class":"thPRECIO"}])+
        creaHTML("th","DESCRIPCION",[{"class":"thDESCRIPCION"}])+
        creaHTML("th","IMAGEN"     ,[{"class":"thIMAGEN"}])
    );
    
    productos.forEach((p)=>{
        html += creaHTML("tr",
                creaHTML("td",p.id,[{"class":"tdIDPRODUCTO"}])
                + creaHTML("td",p.titulo)
                + creaHTML("td",p.precio)
                + creaHTML("td",p.descripcion)
                + creaHTML("td",creaHTML("img",p.imagen,[{"alt":"imagen juego"}]))
        )
    });
    console.log("antes de tabla",html)
    html = creaHTML("table",html,[{"class":"tableCatalogo"},{"border":"1"}]);
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
    while(preguntaOpcionSIoNO(`¿Quieres comprar ${variable} ?\nResponde:\nSI para comprar\nNO seguir viendo catalogo`)){
        let respuesta;
        respuesta = pedirProductoaVender();
        if(respuesta==false) {
            console.log("cancela comprar en id");
            break
        };
        //pasa validacion y recibe datos
        let {id,cantidad}= respuesta;
        
        respuesta = agregarDetalleVenta(id, cantidad);
        if(respuesta==false) {
            console.log("cancela comprar en cantidad")
            break
        };

        variable = "otro producto más";
    }    
}
//--------------------------------------------------------------------------------
/**
 * crea tabla resumen de venta en pantalla
 */
function finalizaVenta(){
    console.log("function finalizaVenta()")

    //ordernar items por título
    venta.sort((a,b)=>{
        return (a.titulo.toUpperCase()>b.titulo.toUpperCase())?1:-1;
    })

    let total_venta=0;
    //calcular total de venta
    total_venta =venta.reduce((total_venta, producto)=>total_venta+producto.total, 0);
    //crear html tabla resumen venta
    let html = creaHTML("tr",
        creaHTML("th","TITULO")+
        creaHTML("th","PRECIO")+
        creaHTML("th","CANTIDAD")+
        creaHTML("th","TOTAL")
    );

    venta.forEach((p)=>{        
        html += creaHTML("tr",
                    creaHTML("td",p.titulo)+
                    creaHTML("td",p.precio)+
                    creaHTML("td",p.cantidad)+
                    creaHTML("td",p.total)
        );
    });
    html += creaHTML("tr",
        creaHTML("td","TOTAL",[{"colspan":3}])+
        creaHTML("td",total_venta)        
    );
    html = creaHTML("table",html,[{"class":"tableCatalogo"},{"border":"1"}]);

    titulo1.innerHTML="Detalle final de la venta"
    titulo2.innerHTML=""

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
        if(id==false)return false; //canceló prompt

        let cantidad = pedirCantidad();
        if (cantidad==false) return false; //canceló prompt
        
        //pasó OK, se retorna datos
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
    
    let id;
    let se_encuentra_producto;
    let se_encuentra_en_venta;

    let sigue_preguntando=true
    do{
        
        //---------------------------------
        /* Pedir ID de producto*/
        let msg = `Ingresar id de producto:`
        id = prompt(msg);
        
        if(id===null){      
            console.log("canceló prompt");
            return false; //canceló prompt
        }
        if(!validaNumeroInt(id) ){
            alert("Debe ingresar un número.");
            continue;
        }
        id = parseInt(id);

        //Revisar que se encuentre producto
        se_encuentra_producto= (   (productos.findIndex(producto=>producto.id===id))!==-1 );

        //si no se encuentra cortar ciclo y pedir ID otra vez
        if(!se_encuentra_producto){
            console.log("no se encuentra en producto en catalogo")
            msg=`Debe ingresar un id de la lista  de productos`;
            alert(msg)
            continue;
        }
        
        console.log("se encontró producto");
        
        //revisar si se encuentra ya el producto pedido en la venta
        // si está preguntar si se reemplaza o pedir otro id
        
        se_encuentra_en_venta = (venta.findIndex(item => item.id === id)!==-1);
        if(se_encuentra_en_venta){
            console.log("se encuentra en venta")
            let producto_venta = venta.find(item => item.id === id);
            msg=`El producto ya se encuentra agregado a la venta\n
            ¿Quieres modificar cantidad de ${producto_venta.cantidad} a vender del producto?\nResponde SI o NO`;
            if(preguntaOpcionSIoNO(msg)){
                sacarProductoDeVenta(id);
            }            
        }
        
        sigue_preguntando=false;
        break;
    }while(sigue_preguntando)

    return id;
}
//--------------------------------------------------------------------------------
/**
 * clase de producto
 */
class productoClass{
    constructor(
        id
        , titulo
        , precio
        , cantidad
        , total
    ){
        this.id       = id
        this.titulo   = titulo
        this.precio   = precio
        this.cantidad = cantidad
        this.total    = total
    }
}
//--------------------------------------------------------------------------------
/**
 * Agregar producto con detalle de cantidad a vender con total
 * @param {Int} producto 
 * @param {Int} cantidad 
 */
function agregarDetalleVenta(id_producto,cantidad){
    console.log("function agregarDetalleVenta()")
    console.log({id_producto})
    console.log({cantidad})
    let producto = productos.find((p)=>{return p.id==id_producto});
    venta.push(
        new productoClass(
             producto.id
            , producto.titulo
            , producto.precio
            ,cantidad
            ,cantidad*producto.precio
        )
    );
    console.log({venta});
    // venta.push({
    //       "id": producto.id
    //     , "titulo": producto.titulo
    //     , "precio": producto.precio
    //     , cantidad
    //     , "total" : cantidad*producto.precio
    // });
}
//--------------------------------------------------------------------------------
/**
 * pide cantidad a vender entre 1 a 100
 * si numero está fuera de rango, se sigue preguntando
 * @returns cantidad
 */
function pedirCantidad(){
    console.log("function pedirCantidad()")
    let cantidad;
    do{
        cantidad= prompt("Indica cantidad a comprar (de 1 a 100) ");
        
        if(cantidad===null) {
            console.log("canceló prompt");
            return false;
        }//canceló prompt

        es_valido   = validaNumeroInt(cantidad) && validaRango(cantidad);
    }while(!es_valido)
    return parseInt(cantidad);
}
//--------------------------------------------------------------------------------
/**
 * retorna verdadero o falso si es que cantidad esta entre 1 y 100 o no.
 * @param {int} cantidad 
 * @returns {boolean}
 */
function validaRango(cantidad){
    console.log("function validaRango()")
    let minimo = 1;
    let maximo = 100;
    let es_rango_valido = (minimo>=0 && cantidad<=maximo);
    if(!es_rango_valido) alert("Cantidad debe ser un rango entre 1 y 100");
    return es_rango_valido;}
//--------------------------------------------------------------------------------
/**
 * retorna true si persona indica SI
 * @param {string} texto_pregunta mensaje a enviar a usuario
 * @returns {boolean}
 */
function preguntaOpcionSIoNO(texto_pregunta){
    console.log("function preguntaOpcionSIoNO()")
    let respuesta_continuar_compra
    let validacion = true;
    do{
        respuesta_continuar_compra = prompt(texto_pregunta);
        if(respuesta_continuar_compra===null){
            console.log("canceló prompt")
            return false
        }
        
        respuesta_continuar_compra = respuesta_continuar_compra.toUpperCase().replace("í","I").replace("Í","I");
        validacion = validaOpcion(respuesta_continuar_compra,["SI","NO"]);
    }while(!validacion);

    console.log("pasó validacion")
    
    return (respuesta_continuar_compra=="SI");
}
//--------------------------------------------------------------------------------
/**
 * valida respuesta contra valores de arreglo de opciones
 * @param {string} respuesta_dada 
 * @param {array} opciones_validas arreglo de opciones validas
 * @returns 
 */
function validaOpcion(respuesta_dada,opciones_validas){
    console.log("function validaOpcion()")
    // console.log({arguments})
    console.log({respuesta_dada})
    
    let txt_opciones_validas = opciones_validas.join(", ");
    let msg = `Opción no válida debe ingresar:\n${txt_opciones_validas}`

    if(respuesta_dada===undefined) {
        alert(msg);
        return false
    };

    let es_opcion_valida     = (opciones_validas.indexOf(respuesta_dada.toUpperCase())!=-1)
    
    console.log({es_opcion_valida})

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
    const indice = venta.findIndex(item => item.id === id);

    if (indice !== -1) {
        venta.splice(indice, 1);
    }
}
//--------------------------------------------------------------------------------
/**
 * valida si es un número entero válido
 * @param {string} valor 
 * @returns {boolean}
 */
function validaNumeroInt(valor){
    console.log("function validaNumeroInt()")
    es_entero = (parseInt(valor) ===parseFloat(valor))

    es_valido = (valor!==null) && (valor!==undefined) && ( !isNaN(valor) ) && es_entero;
    if(!es_valido) alert("Ingresa un número valido");
    return es_valido;
}
//--------------------------------------------------------------------------------