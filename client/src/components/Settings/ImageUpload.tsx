import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadProps {
    maxFiles?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ maxFiles = 1 }) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [crop, setCrop] = useState<Crop>({ unit: '%', width: 30, aspect: 1 });
    const [croppedImage, setCroppedImage] = useState('');

    const inputFileRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                if (reader.result) {
                    setPreviewImage(reader.result as string);
                    setPreviewVisible(true);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (crop: Crop) => {
        if (imageRef.current && crop.width && crop.height) {
            const canvas = document.createElement('canvas');
            const scaleX =
                imageRef.current.naturalWidth / imageRef.current.width;
            const scaleY =
                imageRef.current.naturalHeight / imageRef.current.height;
            const x = crop.x! * scaleX;
            const y = crop.y! * scaleY;
            const width = crop.width! * scaleX;
            const height = crop.height! * scaleY;

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(
                    imageRef.current,
                    x,
                    y,
                    width,
                    height,
                    0,
                    0,
                    width,
                    height
                );
                const base64Image = canvas.toDataURL('image/jpeg');
                setCroppedImage(base64Image);
            }
        }
    };

    const handleCancelPreview = () => {
        setPreviewVisible(false);
    };

    const handleUpload = () => {
        // TODO: Handle image upload and croppedImage
        console.log('Uploaded image:', croppedImage);
        setPreviewVisible(false);
        setPreviewImage('');
        setCroppedImage('');
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={inputFileRef}
                onChange={handleFileChange}
            />
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => inputFileRef.current?.click()}
            >
                Select Image
            </Button>
            <Modal
                open={previewVisible}
                onCancel={handleCancelPreview}
                footer={null}
            >
                <div>
                    <ReactCrop
                        src={previewImage}
                        crop={crop}
                        onChange={(newCrop) => setCrop(newCrop)}
                        onComplete={handleCropComplete}
                        ruleOfThirds
                        circularCrop
                        keepSelection
                        imageStyle={{ maxHeight: '60vh', maxWidth: '90vw' }}
                        style={{ margin: 'auto' }}
                    />
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Button
                            type="primary"
                            onClick={handleUpload}
                            disabled={!croppedImage}
                        >
                            Upload
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ImageUpload;
