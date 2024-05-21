import useApp from '../hooks/useApp'
import InventoryContainer from '../components/InventoryContainer'
import Scroll from '../components/Scroll'

const InventoryPage = () => {
    const { alerta, setAlerta } = useApp();

    return (
        <Scroll>
            <InventoryContainer 
                alerta={alerta}
                setAlerta={setAlerta}
            />
        </Scroll>
  )
}

export default InventoryPage