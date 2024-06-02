import React, { useEffect, useState } from 'react';
import {
    HStack,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Spacer,
    ButtonGroup,
    IconButton
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder, updateOrder } from '../redux/slices/ordersSlice';
import SaleOrderForm from './SaleOrderForm';

const OrderTabs = () => {
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const orders = useSelector(state => state.orders.activeOrders);

    const dispatch = useDispatch();

    // Function to handle new sale order submission
    const handleNewSaleOrderSubmit = (newOrder) => {
        // Dispatch action to add the new order to Redux store
        console.log("New Order Submitted:", newOrder); // Logging the submitted order data
        dispatch(addOrder(newOrder));
        // Close the modal
        setIsModalOpen(false);
    };

    // Filtered orders based on the selected filter
    const filteredOrders = orders.filter(order => {
        if (filter === 'all') {
            return true;
        } else if (filter === 'active') {
            return order.status === 'active';
        } else if (filter === 'completed') {
            return order.status === 'completed';
        } else {
            return true;
        }
    });

    // Function to open the modal
    const handleNewSaleOrder = () => {
        setIsModalOpen(true);
    };

    // Check if the component rerenders after form submission
    useEffect(() => {
        console.log("Component rerendered"); // Logging component rerendering
    }, [orders]); // Rerender when orders state changes

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
                        {/* Render each order in the table */}
                        {filteredOrders.map(order => (
                            <Tr key={order.id}>
                                <Td>{order.id}</Td>
                                <Td>{order.customerName}</Td>
                                <Td>{order.price}</Td>
                                <Td>{order.lastModified}</Td>
                                <Td>
                                    <Button size='xs' mx={1}>Edit/View</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Render the SaleOrderForm with isOpen state and handleNewSaleOrderSubmit function */}
            <SaleOrderForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleNewSaleOrderSubmit} />
        </TableContainer>
    );
};

export default OrderTabs;
