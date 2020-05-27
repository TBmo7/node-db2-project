
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('cars').del()
    .then(function () {
      // Inserts seed entries
      return knex('cars').insert([
        {id: 1, vin: 'ABC123', make: "Chevy", model:"Nova",mileage: 12545.2,transmission:"manual",status:'salvage'},
        {id: 2, vin: '77345ZxK', make: "Ford", model:"E150 Van",mileage: 1222545.2,transmission:"Automatic",status:'repo'},
      ]);
    });
};
