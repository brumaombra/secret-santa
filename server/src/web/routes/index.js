import drawRoutes from './draw.js';

export default app => {
    app.use('/api/draw', drawRoutes);
};