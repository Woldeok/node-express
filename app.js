const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 파일을 업로드할 디렉토리 생성
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

let fileIdCounter = 0; // 파일 ID 카운터 초기값 설정

// 파일 업로드를 위한 multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        fileIdCounter++; // 파일 ID 카운터 증가
        const fileId = fileIdCounter; // 현재 파일 ID
        cb(null, fileId + '-' + Date.now() + path.extname(file.originalname));
    }
});
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ storage: storage });

// 파일 업로드 처리 라우트
app.post('/upload', upload.single('image'), (req, res) => {
    // 업로드된 이미지 정보 출력
    console.log(req.file);
    res.send('이미지가 성공적으로 업로드되었습니다.');
});

// 파일 조회 처리 라우트
app.get('/detail/:id', (req, res) => {
    const fileId = req.params.id; // 클라이언트에서 전달된 파일 ID
    const filePath = path.join(uploadDir, fileId); // 파일 경로

    // 파일이 존재하는지 확인
    fs.stat(filePath, (err, stats) => {
        if (err) {
            console.error('파일 조회 오류:', err);
            res.status(404).send('파일을 찾을 수 없습니다.');
            return;
        }

        // 파일 정보를 클라이언트에 전송
        res.sendFile(filePath);
    });
});
myRouter.get('/aa', (req, res) => {
    res.sendFile(path.join(__dirname, '/a.html'));
}
app.listen(PORT, () => {
    console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
