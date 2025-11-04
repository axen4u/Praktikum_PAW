module.exports = (sequelize, DataTypes) => {
  const Presensi = sequelize.define('Presensi', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'Presensi', // Pastikan sesuai dengan nama tabel di DB
    timestamps: false,
  });

  return Presensi;
};
