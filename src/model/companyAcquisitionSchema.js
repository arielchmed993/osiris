const mongoose = require('mongoose');

const companyAcquisitionSchema = new mongoose.Schema({
    vIsos:[{
      type: String,
      enum: ['ISO 9001-2015', 'ISO 45001-2018', 'ISO 14001-2018', 'ISO 27001-2022', 'ISO 19601-2017', 'ISO 20121-2024', 'ISO 30301-2019', 'ISO 39001-2018', 'ISO 13485-2018', 'ISO 22001-2018', 'ISO 50001-2018', 'ISO 21001-2018', 'ISO 28001-2018', 'ISO 37001-2018', 'ISO 17020-2018 EMA', 'ISO 29001-2020', 'ISO 26001-2019', 'ISO 15189-2023', 'ISO 27701-2019', 'ISO 16949-2016', 'ISO 17025-2017', 'ISO 22716-2008', 'ISO 22301-2019', 'ISO 24001-2015', 'ISO 17021-2015', 'RRHH'],
      required: true
    }],
    typeOfAcquisition: { 
      type: String, 
      enum: ['Alquiler', 'Gratuito', 'Compra'],
      required: true
    },
    dDateAcquired: { type: Date, required: true, default: Date.now },
    dExpirationDate: { type: Date },
    vLinkInvoice: {type: String}
});

// Pre-save hook para calcular dExpirationDate
companyAcquisitionSchema.pre('save', function(next) {
  try {
      const vName = this.typeOfAcquisition;

      if (vName === 'Alquiler' || vName === 'Gratuito') {
          // Si es "Alquiler" o "Gratuito", sumamos 2 meses a dDateAcquired
          const dDateAcquired = this.dDateAcquired;
          const dExpirationDate = new Date(dDateAcquired);
          dExpirationDate.setMonth(dExpirationDate.getMonth() + 2);
          this.dExpirationDate = dExpirationDate;
      } else if (vName === 'Compra') {
          // Si es "Compra", ponemos null en dExpirationDate
          this.dExpirationDate = null;
      }

      next();
  } catch (err) {
      next(err);
  }
});


module.exports = mongoose.model('companyAcquisition', companyAcquisitionSchema);