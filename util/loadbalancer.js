// load balancing logic is here
loadbalancer = {};

// create round robin function
loadbalancer.ROUND_ROBIN = (service) => {
  const newIndex =
    ++service.index >= service.instances.length ? 0 : service.index;
  service.index = newIndex;
  return loadbalancer.isEnabled(service, newIndex, loadbalancer.ROUND_ROBIN);
};

loadbalancer.isEnabled = (service, index, loadBalanceStrategy) => {
  /**
   * Periksa apakah status enabled-nya true atau false
   * Jika true maka berikan request ke aplikasi tersebut
   * Jika false maka berikan request ke aplikasi yang true
   * Tentunya dengan metode Round Robin
   */
  return service.instances[index].enabled
    ? index
    : loadBalanceStrategy(service);
};

module.exports = loadbalancer;
