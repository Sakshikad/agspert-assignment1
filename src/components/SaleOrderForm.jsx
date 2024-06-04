import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input,
  Select, Checkbox, VStack, HStack, FormControl, FormLabel, ButtonGroup,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { addOrder, updateOrder } from "../redux/slices/ordersSlice";
import SelectedProductsInput from "./SelectedProductsInput.jsx";

const SaleOrderForm = ({ isOpen, onClose, existingOrder, readonly }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);
  const products = useSelector((state) => state.products.products);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (existingOrder) {
      setValue("invoice_number", existingOrder.invoice_no || "");
      setValue("invoice_date", existingOrder.invoice_date || "");
      setValue("paid", existingOrder.paid || false);
      setSelectedCustomer(existingOrder.customer_id || "");
      setSelectedProducts(
        existingOrder.items ? existingOrder.items.map((item) => item.sku_id) : []
      );
    } else {
      reset();
    }
  }, [existingOrder, setValue, reset, customers]);

  const updateLocalOrders = (data) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = existingOrder
      ? orders.map((order) =>
        order.invoice_no === existingOrder.invoice_no
          ? { ...order, ...data }
          : order
      )
      : [...orders, data];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const onSubmit = (data) => {

    const currentDate = new Date().toISOString().split('T')[0];
    const orderData = {
      ...data,
      customer_id: selectedCustomer,
      items: selectedProducts,
      totalPrice,
      totalItems,
      lastModified: currentDate,
    };
    if (existingOrder) {
      dispatch(updateOrder({ ...orderData, id: existingOrder.id }));

    } else {
      dispatch(addOrder(orderData));
    }
    updateLocalOrders(orderData);
    onClose();
    reset();
  };

  const updateTotals = (items, price) => {
    setTotalItems(items);
    setTotalPrice(price);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {existingOrder ? "Edit Sale Order" : "Create Sale Order"}
        </ModalHeader>
        <ModalBody>
          <VStack as="form" spacing={4} width="100%">
            <FormControl isInvalid={errors.invoice_number}>
              <FormLabel>Invoice Number</FormLabel>
              <Input
                placeholder="Invoice Number"
                {...register("invoice_number", {
                  required: "Invoice number is required",
                })}
                readOnly={readonly}
              />
            </FormControl>
            <FormControl isInvalid={errors.invoice_date}>
              <FormLabel>Invoice Date</FormLabel>
              <Input
                type="date"
                placeholder="Invoice Date"
                {...register("invoice_date", {
                  required: "Invoice date is required",
                })}
                readOnly={readonly}
              />
            </FormControl>
            <FormControl isInvalid={errors.customer_id}>
              <FormLabel>Customer</FormLabel>
              <Select
                placeholder="Select Customer"
                {...register("customer_id", {
                  required: "Customer is required",
                })}
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                readOnly={readonly}
              >
                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.name}
                  >
                    {customer.customer_profile.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isInvalid={errors.products}>
              <FormLabel>Products</FormLabel>
              <SelectedProductsInput
                products={products}
                selectedProducts={selectedProducts}
                onChange={setSelectedProducts}
                updateTotals={updateTotals}
                readonly={readonly}
              />
            </FormControl>
            <HStack spacing={4} justifyContent="flex-end">
              <Button colorScheme="green" size="xs">
                Total Price: {totalPrice}
              </Button>
              <Button colorScheme="green" size="xs" >
                Total Items: {totalItems}
              </Button>
            </HStack>
            <FormControl>
              <Checkbox {...register("paid")} readOnly={readonly}>Paid</Checkbox>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing={4} width="100%">
            <Button size="md" colorScheme="red" onClick={onClose} flex="1">
              Discard
            </Button>
            {!readonly && (
              <Button
                size="md"
                colorScheme="green"
                type="submit"
                flex="1"
                onClick={handleSubmit(onSubmit)}
              >
                {existingOrder ? "Update Sale Order" : "Create Sale Order"}
              </Button>
            )}
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaleOrderForm;
