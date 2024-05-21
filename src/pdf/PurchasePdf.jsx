import { jsPDF } from 'jspdf' 
import 'jspdf-autotable'
import formatearFecha from '../helpers/formatearFecha'
import formatearDinero from '../helpers/formatearDinero'

const PurchasePdf = ({ordenCompra}) => {
    const generarPDF = () => {
        const doc = new jsPDF();

        // Crear Tabla Productos
        const columns = ['#', 'Cant', 'Unidad', 'Clave', 'Producto', 'C.Unitario', 'P.Total'];

        const rows = [];

        for(let i = 0; i < ordenCompra.Products.length; i++) {
            rows[i] = [
                `${i+1}`, 
                `${ordenCompra.Products[i].Quantity}`, 
                `Unidad`, 
                `${ordenCompra.Products[i].Folio}`, 
                `${ordenCompra.Products[i].Name}\n${ordenCompra.Products[i].Description}`, 
                `${formatearDinero(ordenCompra.Products[i].Cost)}`, 
                `${formatearDinero(ordenCompra.Products[i].Cost * ordenCompra.Products[i].Quantity)}`, 
            ]
        }

        doc.addImage("https://res.cloudinary.com/dmap6p5wl/image/upload/v1715021801/xfbn1wn5v3eihljrltrp.png", "PNG", 15, 15, 30, 20);
        doc.setFontSize(12);
        doc.text('MOPAL GRUPO S.A. DE C.V.', 46, 18);
        doc.setFontSize(9);
        doc.text('Carlos Salazar #1930 Pte.', 46, 22);
        doc.text('Col. Centro C.P 64000', 46, 26);
        doc.text('Monterrey, Nuevo Leon', 46, 30);
        doc.text('R.F.C: MGR150224B26', 46, 34);

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text('Orden de compra', 196,20, null, null, "right")
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text('Folio: ', 160, 28)
        doc.setFontSize(16)
        doc.setTextColor(100);
        doc.text(`${ordenCompra.Folio}`, 196, 28, null, null, "right")
        doc.setTextColor(0);
        doc.setFontSize(10)
        doc.text('Por surtir', 196, 33, null, null, "right")
        doc.text(formatearFecha(ordenCompra.PurchaseDate), 196, 38, null, null, "right")
        
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold");
        doc.text('Ordenado a:', 15, 50)
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150);
        doc.text(`${ordenCompra.BusinessName}`, 15, 56)
        doc.setTextColor(0);
        doc.text(`${ordenCompra.Address}`, 15, 62)
        doc.text(`RFC: ${ordenCompra.RFC}`, 15, 68)
        
        doc.setFont("helvetica", "bold");
        doc.text('Atencion a:', 15, 75)
        doc.text('Contacto:', 15, 82)
        
        doc.setFont("helvetica", "normal");
        doc.text('Brenda Hernandez', 50, 75)
        doc.text('Ing. Pablo Martinez', 50, 82)

        doc.autoTable(columns, rows, {
            startY: 88,
            styles: { overflow: "linebreak" },
            bodyStyles: { valign: "top" },
            theme: "striped",
            didDrawPage: function (data) {
                doc.line(15, 283, 196, 283); 
                doc.setFontSize(8)
                doc.text('MOPAL GRUPO   RFC:MGR150224B26', 15, 287)
                doc.setFontSize(6)
                doc.setFont("helvetica", "italic");
                doc.text('Carlos Salazar Poniente 1930, Monterrey Centro, Del Monterrey, Monterrey, Nuevo Leon, Mexico, CP. 64000', 15, 290)
                
            }
        })

        var finalY = doc.previousAutoTable.finalY;

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold");
        doc.text("Observaciones", 15, finalY + 10)
        doc.setFont("helvetica", "normal");
        doc.text(`${ordenCompra.Observation}`, 15, finalY + 14)

        // Guardar PDF
        doc.save(`OrdenCompra_${ordenCompra.Folio}.pdf`);
    }

    return (
        <>
            <button className='btn btn-primary w-100' onClick={() => generarPDF()}>Generar PDF</button>
        </>
    );
}

export default PurchasePdf;