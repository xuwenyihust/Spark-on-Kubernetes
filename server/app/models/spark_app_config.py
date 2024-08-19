from database import db

class SparkAppConfigModel(db.Model):
  
    __tablename__ = 'spark_app_config'
  
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    notebook_id = db.Column(db.Integer, db.ForeignKey('notebooks.id'), nullable=False)
    driver_memory = db.Column(db.String, nullable=True)
    driver_memory_overhead = db.Column(db.String, nullable=True)
    driver_cores = db.Column(db.Integer, nullable=True)

    executor_memory = db.Column(db.String, nullable=True)
    executor_memory_overhead = db.Column(db.InStringteger, nullable=True)
    executor_memory_fraction = db.Column(db.Float, nullable=True)
    executor_cores = db.Column(db.Integer, nullable=True)
    executor_instances = db.Column(db.Integer, nullable=True)

    dynamic_allocation_enabled = db.Column(db.Boolean, nullable=True)
    executor_instances_min = db.Column(db.Integer, nullable=True)
    executor_instances_max = db.Column(db.Integer, nullable=True)
    
    shuffle_service_enabled = db.Column(db.Boolean, nullable=True)
    executor_idle_timeout = db.Column(db.Integer, nullable=True)
    queue = db.Column(db.String, nullable=True)

    def __init__(self, notebook_id, driver_memory=None, driver_memory_overhead=None, driver_cores=None,
                 executor_memory=None, executor_memory_overhead=None, executor_memory_fraction=None,
                 executor_cores=None, executor_instances=None, dynamic_allocation_enabled=None,
                 executor_instances_min=None, executor_instances_max=None, shuffle_service_enabled=None,
                 executor_idle_timeout=None, queue=None):
        self.notebook_id = notebook_id
        self.driver_memory = driver_memory
        self.driver_memory_overhead = driver_memory_overhead
        self.driver_cores = driver_cores
        self.executor_memory = executor_memory
        self.executor_memory_overhead = executor_memory_overhead
        self.executor_memory_fraction = executor_memory_fraction
        self.executor_cores = executor_cores
        self.executor_instances = executor_instances
        self.dynamic_allocation_enabled = dynamic_allocation_enabled
        self.executor_instances_min = executor_instances_min
        self.executor_instances_max = executor_instances_max
        self.shuffle_service_enabled = shuffle_service_enabled
        self.executor_idle_timeout = executor_idle_timeout
        self.queue = queue

    def to_dict(self):
        return {
            'notebook_id': self.notebook_id,
            'driver_memory': self.driver_memory,
            'driver_memory_overhead': self.driver_memory_overhead,
            'driver_cores': self.driver_cores,
            'executor_memory': self.executor_memory,
            'executor_memory_overhead': self.executor_memory_overhead,
            'executor_memory_fraction': self.executor_memory_fraction,
            'executor_cores': self.executor_cores,
            'executor_instances': self.executor_instances,
            'dynamic_allocation_enabled': self.dynamic_allocation_enabled,
            'executor_instances_min': self.executor_instances_min,
            'executor_instances_max': self.executor_instances_max,
            'shuffle_service_enabled': self.shuffle_service_enabled,
            'executor_idle_timeout': self.executor_idle_timeout,
            'queue': self.queue
        }
