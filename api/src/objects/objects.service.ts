import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectEntry } from './object.schema';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class ObjectsService {
  private s3: S3Client;

  constructor(
    @InjectModel(ObjectEntry.name) private model: Model<ObjectEntry>,
  ) {
    this.s3 = new S3Client({
      region: 'eu-west-1',
      endpoint: process.env.S3_ENDPOINT as string,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_SECRET_KEY as string,
      },
    });
  }

  async create(data: any, file: Express.Multer.File) {
    const safeName = file.originalname
      .normalize('NFD') // Sépare les accents des lettres
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-zA-Z0-9.-]/g, '_'); // Remplace les espaces et spéciaux par des underscores
    const fileName = `${Date.now()}-${safeName}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const imageUrl = `${process.env.S3_PUBLIC_URL}/${fileName}`;
    return new this.model({ ...data, imageUrl }).save();
  }

  async findAll() {
    return this.model.find().sort({ createAt: -1 });
  }

  async delete(id: string) {
    const obj = await this.model.findById(id);
    if (obj) {
      const key = obj.imageUrl.split('/').pop();
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
        }),
      );
      await this.model.findByIdAndDelete(id);
    }
  }
}
