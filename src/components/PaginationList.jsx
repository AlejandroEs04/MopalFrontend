import { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination'
import TableSales from './TableSales';
import TablePurchases from './TablePurchases';
import TableRequest from './TableRequest';

const PaginationList = ({ items, limit = 10, type }) => {
    const [currentPage, setCurrentPage] = useState(1);
    let itemsPagination = []
    let limitArray = items.length / limit
    for(let i = 0; i<limitArray;i++) {
        itemsPagination.push(
            <Pagination.Item key={i} onClick={() => setCurrentPage(i + 1)} active={i === currentPage - 1}>
                {i+1}
            </Pagination.Item>
        )
    }

    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    return (
        <div className=''>
            {type === 1 && (
                <TableSales 
                    sales={items}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    actionStorage
                />
            )}
            
            {type === 2 && (
                <TablePurchases 
                    purchase={items}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    actionStorage
                />
            )}
            
            {type === 3 && (
                <TableRequest 
                    items={items}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    actionStorage
                />
            )}
            <div className='d-flex justify-content-center'>
                <Pagination size="sm">{itemsPagination}</Pagination>
            </div>
            
        </div>
    )
}

export default PaginationList