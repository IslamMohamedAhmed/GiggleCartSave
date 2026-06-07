export const validationFileOptions = {
    Image: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/tiff',
        'image/svg+xml',
        'image/x-icon',
        'image/heic',
        'image/heif',
        'image/avif',
    ],

    Video: [
        'video/mp4',
        'video/mpeg',
        'video/quicktime', // .mov
        'video/x-msvideo', // .avi
        'video/x-matroska', // .mkv
        'video/webm',
        'video/ogg',
        'video/3gpp', // .3gp
        'video/3gpp2', // .3g2
        'video/x-flv', // .flv
        'video/x-ms-wmv', // .wmv
        'video/mp2t', // .ts
        'video/avi',
    ],

    PDF: ['application/pdf'],

    Word: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],

    Excel: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],

    Audio: [
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/webm',
        'audio/mp3',
        'audio/aac',
        'audio/flac',
        'audio/x-flac',
        'audio/x-m4a',
    ],
};