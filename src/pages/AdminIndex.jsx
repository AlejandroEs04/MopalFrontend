import InventoryContainer from '../components/InventoryContainer'
import InventoryReport from '../components/InventoryReport'
import '../styles/AdminStyles.css'

const AdminIndex = () => {
  return (
    <div>
      <InventoryContainer 
        fullPage
      />

      <InventoryReport />
    </div>
    )
}

export default AdminIndex