import Redis from 'ioredis';

// Configuration with fallbacks to the provided credentials
// Ideally these should be in the .env file
const redisConfig = {
  host: process.env.REDIS_HOST || 'redis-11023.c269.eu-west-1-3.ec2.cloud.redislabs.com',
  port: parseInt(process.env.REDIS_PORT || '11023'),
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD || 'ktwlRqz8VC24ojO7TNFIx0r99GZut2bw',
};

const redis = new Redis(redisConfig);

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

export default redis;
