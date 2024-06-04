import React, { useState } from 'react';
import { HStack, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Spacer, ButtonGroup, IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../redux/slices/ordersSlice';
import SaleOrderForm from './SaleOrderForm';

const OrderTabs = () => {
    const [filter, setFilter] = useState('active');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const orders = useSelector(state => state.orders.activeOrders);
    const dispatch = useDispatch();

    const handleNewSaleOrderSubmit = (newOrder) => {
        dispatch(addOrder(newOrder));
        setIsModalOpen(false);
        setEditingOrder(null);
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'active') {
            return !order.paid; 
        } else if (filter === 'completed') {
            return order.paid; 
        }
    });

    const handleNewSaleOrder = () => {
        setEditingOrder(null);
        setIsModalOpen(true);
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
        setIsModalOpen(true);
    };

    const handleViewOrder = (order) => {
        setEditingOrder(order);
        setIsModalOpen(true);
    };

    return (
        <TableContainer mx={4}>
            <HStack spacing={4} mb={4}>
                <Button colorScheme="green" onClick={() => setFilter('active')} isActive={filter === 'active'}>
                    Active Orders
                </Button>
                <Button colorScheme="green" onClick={() => setFilter('completed')} isActive={filter === 'completed'}>
                    Completed Orders
                </Button>
                <Spacer />
                <ButtonGroup size='sm' isAttached variant='outline' colorScheme="green">
                    <IconButton aria-label='Add Sale Order' icon={<AddIcon />} onClick={handleNewSaleOrder} />
                    <Button onClick={handleNewSaleOrder}>Sale Order</Button>
                </ButtonGroup>
            </HStack>

            <TableContainer borderWidth='1px' mx={8} my={4}>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Customer Name</Th>
                            <Th>Price</Th>
                            <Th>Last Modified</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredOrders.map((order, index) => (
                            <Tr key={order.id || index}>
                                <Td>{index + 1}</Td>
                                <Td>{order.customer_id}</Td>
                                <Td>{order.totalPrice}</Td>
                                <Td>{new Date(order.lastModified).toLocaleDateString()}</Td> 
                                <Td>
                                    {order.paid ? (
                                        <Button size='xs' mx={1} onClick={() => handleViewOrder(order)}>View</Button>
                                    ) : (
                                        <Button size='xs' mx={1} onClick={() => handleEditOrder(order)}>Edit</Button>
                                    )}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <SaleOrderForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                existingOrder={editingOrder}
            />
        </TableContainer>
    );
};

export default OrderTabs;
