"use client";

import React, { useState, useEffect } from 'react';

const ReportsPage = () => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [inventoryStockReport, setInventoryStockReport] = useState(null);
  const [inventoryCostReport, setInventoryCostReport] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [suppliersReport, setSuppliersReport] = useState(null);
  const [productAvailabilityReport, setProductAvailabilityReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    const fetchStoresAndProducts = async () => {
      try {
        const storesResponse = await fetch('/api/store');
        const storesData = await storesResponse.json();
        setStores(storesData);

        const productsResponse = await fetch('/api/product');
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStoresAndProducts();
  }, []);

  const handleStoreChange = (storeId) => {
    setSelectedStores((prevSelectedStores) =>
      prevSelectedStores.includes(storeId)
        ? prevSelectedStores.filter((id) => id !== storeId)
        : [...prevSelectedStores, storeId]
    );
  };

  const handleProductChange = (productId) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.includes(productId)
        ? prevSelectedProducts.filter((id) => id !== productId)
        : [...prevSelectedProducts, productId]
    );
  };

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const storeIds = selectedStores.join(',');
      const productIds = selectedProducts.join(',');

      const stockResponse = await fetch(`/api/report/inventory-stock/${storeIds}`);
      const stockData = await stockResponse.json();
      setInventoryStockReport(stockData);

      const costResponse = await fetch(`/api/report/cost-inventory/${storeIds}`);
      const costData = await costResponse.json();
      setInventoryCostReport(costData);

      const salesResponse = await fetch(`/api/report/date-inventory/${storeIds}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tienda: storeIds, fechaInicio, fechaFin })
      });
      const salesData = await salesResponse.json();
      setSalesReport(salesData);

      const suppliersResponse = await fetch(`/api/report/supplier/${productIds}`, { method: 'POST' });
      const suppliersData = await suppliersResponse.json();
      setSuppliersReport(suppliersData);

      const availabilityResponse = await fetch(`/api/report/product-store/${productIds}`, { method: 'POST' });
      const availabilityData = await availabilityResponse.json();
      setProductAvailabilityReport(availabilityData);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getStoreNameById = (storeId) => {
    const store = stores.find((store) => store._id === storeId);
    return store ? store.nombre : storeId;
  };

  const getProductNameById = (productId) => {
    const product = products.find((product) => product._id === productId);
    return product ? product.nombre : productId;
  };

  return (
    <div className="p-6 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Reportes</h1>
  
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Seleccionar Tiendas</h3>
        {stores.map((store) => (
          <div key={store._id} className="flex items-center mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                value={store._id}
                onChange={() => handleStoreChange(store._id)}
                className="mr-2"
              />
              {store.nombre}
            </label>
          </div>
        ))}
  
        <h3 className="text-xl font-semibold mb-3">Seleccionar Productos</h3>
        {products.map((product) => (
          <div key={product._id} className="flex items-center mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                value={product._id}
                onChange={() => handleProductChange(product._id)}
                className="mr-2"
              />
              {product.nombre}
            </label>
          </div>
        ))}
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700">Fecha Inicio:</span>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700">Fecha Fin:</span>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </label>
        </div>
  
        <button
          onClick={fetchReports}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generar Reportes
        </button>
      </div>
  
      {loading && <div className="text-blue-500 mt-4">Cargando...</div>}
      {error && <div className="text-red-500 mt-4">Error: {error}</div>}
  
      {/* Reporte de Stock de Inventario */}
      <section className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Reporte de Stock de Inventario</h2>
        {inventoryStockReport && inventoryStockReport.datos && (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Producto</th>
                <th className="border px-4 py-2">Descripción</th>
                <th className="border px-4 py-2">Precio</th>
                <th className="border px-4 py-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {inventoryStockReport.datos.detalles.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{item.producto}</td>
                  <td className="border px-4 py-2">{item.descripcion}</td>
                  <td className="border px-4 py-2">{item.precio}</td>
                  <td className="border px-4 py-2">{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
  
      {/* Reporte de Costo de Inventario */}
      <section className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Reporte de Costo de Inventario</h2>
        {inventoryCostReport && inventoryCostReport.datos && (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Producto</th>
                <th className="border px-4 py-2">Precio</th>
                <th className="border px-4 py-2">Cantidad</th>
                <th className="border px-4 py-2">Costo</th>
              </tr>
            </thead>
            <tbody>
              {inventoryCostReport.datos.detalles.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{item.producto}</td>
                  <td className="border px-4 py-2">{item.precio}</td>
                  <td className="border px-4 py-2">{item.cantidad}</td>
                  <td className="border px-4 py-2">{item.costo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
  
      {/* Reporte de Ventas */}
      <section className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Reporte de Ventas</h2>
        {salesReport && salesReport.datos && (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Fecha</th>
                <th className="border px-4 py-2">Producto</th>
                <th className="border px-4 py-2">Descripción</th>
                <th className="border px-4 py-2">Precio</th>
                <th className="border px-4 py-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {salesReport.datos.detalles.map((order, index) => (
                <React.Fragment key={index}>
                  {order.productos.map((product, pIndex) => (
                    <tr key={pIndex} className="text-center">
                      <td className="border px-4 py-2">{order.fecha}</td>
                      <td className="border px-4 py-2">{product.nombre}</td>
                      <td className="border px-4 py-2">{product.descripcion}</td>
                      <td className="border px-4 py-2">{product.precio}</td>
                      <td className="border px-4 py-2">{product.cantidad}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </section>
  
      {/* Reporte de Proveedores */}
      {/* <section className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Reporte de Proveedores</h2>
        {suppliersReport && suppliersReport.datos && (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Proveedor</th>
                <th className="border px-4 py-2">Dirección</th>
                <th className="border px-4 py-2">Contacto</th>
                <th className="border px-4 py-2">Condiciones de Pago</th>
                <th className="border px-4 py-2">Producto</th>
                <th className="border px-4 py-2">Descripción</th>
                <th className="border px-4 py-2">Precio de Compra</th>
                <th className="border px-4 py-2">Cantidad</th>
                <th className="border px-4 py-2">Término de Entrega</th>
              </tr>
            </thead>
            <tbody>
              {suppliersReport.datos.detalles.map((supplier, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{supplier.proveedor.nombre}</td>
                  <td className="border px-4 py-2">{supplier.proveedor.direccion}</td>
                  <td className="border px-4 py-2">{`${supplier.proveedor.contacto.correo}, ${supplier.proveedor.contacto.telefono}`}</td>
                  <td className="border px-4 py-2">{supplier.proveedor.condicionesPago}</td>
                  {supplier.productos.map((product, pIndex) => (
                    <React.Fragment key={pIndex}>
                      <td className="border px-4 py-2">{product.nombre}</td>
                      <td className="border px-4 py-2">{product.descripcion}</td>
                      <td className="border px-4 py-2">{product.precioCompra}</td>
                      <td className="border px-4 py-2">{product.cantidad}</td>
                      <td className="border px-4 py-2">{product.terminoEntrega}</td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section> */}
  
      {/* Reporte de Disponibilidad de Producto */}
      <section className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Reporte de Disponibilidad de Producto</h2>
        {productAvailabilityReport && productAvailabilityReport.datos && (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Tienda</th>
                <th className="border px-4 py-2">Producto</th>
                <th className="border px-4 py-2">Cantidad Disponible</th>
              </tr>
            </thead>
            <tbody>
              {productAvailabilityReport.datos.disponibilidad.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{getStoreNameById(item.tienda)}</td>
                  <td className="border px-4 py-2">{productAvailabilityReport.datos.producto}</td>
                  <td className="border px-4 py-2">{item.cantidadDisponible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
  
};

export default ReportsPage;
