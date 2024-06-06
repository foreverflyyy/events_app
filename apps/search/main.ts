import {NestFactory} from '@nestjs/core';
import {SearchModule} from './search.module';

const start = async () => {
    const app = await NestFactory.create(SearchModule);


    const PORT = process.env.PORT || 5005;
    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
};

(async () => {
    await start();
})();