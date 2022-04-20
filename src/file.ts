import { promises as fs } from 'fs';
import path from 'path';
import processImage from './image-processing'; // Image handling

// query segments
interface ImageQuery {
  file?: string;
  width?: string;
  height?: string;
}

export default class File {
  // Default paths
  static imagesFullPath = path.resolve(__dirname, '../assets/images/full');
  static imagesThumbPath = path.resolve(__dirname, '../assets/images/thumb');

  /**
   * Determine image path.
   * @param {ImageQuery} params Parameters.
   * @param {string} [params.file] file.
   * @param {string} [params.width] Desired width.
   * @param {string} [params.height] Desired height.
   * @return {null|string} Path, if image available, else null.
   */
  static async getImagePath(params: ImageQuery): Promise<null | string> {
    if (!params.file) {
      return null;
    }

    // Build appropriate path
    const filePath: string =
      params.width && params.height
        ? path.resolve(
            File.imagesThumbPath,
            `${params.file}-${params.width}x${params.height}.jpg`
          )
        : path.resolve(File.imagesFullPath, `${params.file}.jpg`);

    // Check file existence
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      return null;
    }
  }

  /**
   * Check if an image is available.
   * @param {string} [file=''] file (without file extension).
   * @return {boolean} True if image is available, else false.
   */
  static async isImageAvailable(file: string = ''): Promise<boolean> {
    if (!file) {
      return false; // Fail early
    }

    return (await File.getAvailableImageNames()).includes(file);
  }

  /**
   * Retrieve available image names.
   * @return {string[]} Available image names (without file extension).
   */
  static async getAvailableImageNames(): Promise<string[]> {
    try {
      return (await fs.readdir(File.imagesFullPath)).map(
        (file: string): string => file.split('.')[0]
      ); // Cut extension
    } catch {
      return [];
    }
  }

  /**
   * Determine whether a thumb is already available.
   * @param {ImageQuery} params Parameters.
   * @param {string} [params.file] file.
   * @param {string} [params.width] Desired width.
   * @param {string} [params.height] Desired height.
   * @return {boolean} True, if thumb is available, else false.
   */
  static async isThumbAvailable(params: ImageQuery): Promise<boolean> {
    if (!params.file || !params.width || !params.height) {
      return false; // Fail early
    }

    // Set appropriate path
    const filePath: string = path.resolve(
      File.imagesThumbPath,
      `${params.file}-${params.width}x${params.height}.jpg`
    );

    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Create thumb path.
   */
  static async createThumbPath(): Promise<void> {
    try {
      await fs.access(File.imagesThumbPath);
      // Path already available
    } catch {
      fs.mkdir(File.imagesThumbPath);
    }
  }

  /**
   * Create thumb file.
   * @param {ImageQuery} params Parameters.
   * @param {string} [params.file] file.
   * @param {string} [params.width] Desired width.
   * @param {string} [params.height] Desired height.
   * @return {null|string} Error message or null.
   */
  static async createThumb(params: ImageQuery): Promise<null | string> {
    if (!params.file || !params.width || !params.height) {
      return null; // Nothing to do
    }

    const filePathFull: string = path.resolve(
      File.imagesFullPath,
      `${params.file}.jpg`
    );
    const filePathThumb: string = path.resolve(
      File.imagesThumbPath,
      `${params.file}-${params.width}x${params.height}.jpg`
    );

    console.log(`Creating thumb ${filePathThumb}`);

    // Resize original image and store as thumb
    return await processImage({
      source: filePathFull,
      target: filePathThumb,
      width: parseInt(params.width),
      height: parseInt(params.height)
    });
  }
}
