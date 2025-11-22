import api from './api'

const reportsService = {
  // Get product inventory report
  getProductReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/reports/products?${queryString}`)
    return response.data.data
  },

  // Get delivery report
  getDeliveryReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/reports/deliveries?${queryString}`)
    return response.data
  },

  // Get receipt report
  getReceiptReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/reports/receipts?${queryString}`)
    return response.data
  },

  // Get transfer report
  getTransferReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/reports/transfers?${queryString}`)
    return response.data
  },

  // Get stock movement report
  getStockMovementReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/reports/stock-movement?${queryString}`)
    return response.data
  },

  // Get warehouse summary
  getWarehouseSummary: async () => {
    const response = await api.get('/reports/warehouse-summary')
    return response.data.data
  },

  // Export to CSV
  exportToCSV: (data, filename, columns = null) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    // Get column headers
    const keys = columns || Object.keys(data[0]);
    
    // Create CSV content
    let csv = keys.join(',') + '\n';
    
    data.forEach(row => {
      const values = keys.map(key => {
        let value = row[key];
        
        // Handle values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        // Format dates
        if (value instanceof Date) {
          value = value.toLocaleDateString();
        }
        
        return value ?? '';
      });
      csv += values.join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export to JSON
  exportToJSON: (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default reportsService
