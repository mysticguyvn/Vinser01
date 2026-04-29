-- Seed Categories
INSERT INTO categories (name, type) VALUES
('Kỹ năng', 'skills'),
('Sở thích', 'interests'),
('Nhu cầu (đang cần)', 'needs'),
('Định hướng học tập / Chuyên ngành', 'major'),
('Chủ đề quan tâm', 'topics'),
('Game / Giải trí số', 'gaming')
ON CONFLICT (name) DO NOTHING;

-- Seed Tags
DO $$
DECLARE
    cat_skills UUID;
    cat_interests UUID;
    cat_needs UUID;
    cat_major UUID;
    cat_topics UUID;
    cat_gaming UUID;
BEGIN
    SELECT id INTO cat_skills FROM categories WHERE name = 'Kỹ năng';
    SELECT id INTO cat_interests FROM categories WHERE name = 'Sở thích';
    SELECT id INTO cat_needs FROM categories WHERE name = 'Nhu cầu (đang cần)';
    SELECT id INTO cat_major FROM categories WHERE name = 'Định hướng học tập / Chuyên ngành';
    SELECT id INTO cat_topics FROM categories WHERE name = 'Chủ đề quan tâm';
    SELECT id INTO cat_gaming FROM categories WHERE name = 'Game / Giải trí số';

    -- Skills
    INSERT INTO tags (category_id, name, is_system) VALUES
    (cat_skills, 'Thuyết trình', true), (cat_skills, 'Viết nội dung', true),
    (cat_skills, 'Copywriting', true), (cat_skills, 'Thiết kế đồ họa', true),
    (cat_skills, 'UI/UX', true), (cat_skills, 'Canva', true),
    (cat_skills, 'Chỉnh sửa video', true), (cat_skills, 'Nhiếp ảnh', true),
    (cat_skills, 'Lập trình Front-end', true), (cat_skills, 'Lập trình Back-end', true),
    (cat_skills, 'Phân tích dữ liệu', true), (cat_skills, 'Nghiên cứu', true),
    (cat_skills, 'Tổ chức sự kiện', true), (cat_skills, 'MC/Dẫn chương trình', true),
    (cat_skills, 'Leadership', true), (cat_skills, 'Làm việc nhóm', true),
    (cat_skills, 'Tiếng Anh giao tiếp', true), (cat_skills, 'Tiếng Anh học thuật', true)
    ON CONFLICT (category_id, name) DO NOTHING;

    -- Interests
    INSERT INTO tags (category_id, name, is_system) VALUES
    (cat_interests, 'Đọc sách', true), (cat_interests, 'Âm nhạc', true),
    (cat_interests, 'Ca hát', true), (cat_interests, 'Chơi nhạc cụ', true),
    (cat_interests, 'Chụp ảnh', true), (cat_interests, 'Quay video', true),
    (cat_interests, 'Xem phim', true), (cat_interests, 'Anime/Manga', true),
    (cat_interests, 'Du lịch', true), (cat_interests, 'Tình nguyện', true),
    (cat_interests, 'Bóng đá', true), (cat_interests, 'Cầu lông', true),
    (cat_interests, 'Bóng rổ', true), (cat_interests, 'Chạy bộ', true),
    (cat_interests, 'Gym', true), (cat_interests, 'Cờ vua', true),
    (cat_interests, 'Board game', true), (cat_interests, 'Nấu ăn', true),
    (cat_interests, 'Thời trang', true), (cat_interests, 'Công nghệ', true)
    ON CONFLICT (category_id, name) DO NOTHING;

    -- Needs
    INSERT INTO tags (category_id, name, is_system) VALUES
    (cat_needs, 'Tìm teammate dự án', true), (cat_needs, 'Tìm bạn học cùng', true),
    (cat_needs, 'Làm portfolio', true), (cat_needs, 'Luyện tiếng Anh', true),
    (cat_needs, 'Săn học bổng', true), (cat_needs, 'Du học', true),
    (cat_needs, 'Thực tập', true), (cat_needs, 'Tham gia CLB', true),
    (cat_needs, 'Tuyển thành viên', true), (cat_needs, 'Làm sản phẩm', true),
    (cat_needs, 'Tham gia cuộc thi', true), (cat_needs, 'Tìm mentor', true),
    (cat_needs, 'Networking', true), (cat_needs, 'Phát triển bản thân', true)
    ON CONFLICT (category_id, name) DO NOTHING;

    -- Major
    INSERT INTO tags (category_id, name, is_system) VALUES
    (cat_major, 'CNTT', true), (cat_major, 'Khoa học dữ liệu', true),
    (cat_major, 'Kinh tế', true), (cat_major, 'Marketing', true),
    (cat_major, 'Tài chính-Ngân hàng', true), (cat_major, 'Quản trị kinh doanh', true),
    (cat_major, 'Thiết kế', true), (cat_major, 'Truyền thông', true),
    (cat_major, 'Ngôn ngữ', true), (cat_major, 'Luật', true),
    (cat_major, 'Y dược', true), (cat_major, 'Tâm lý học', true),
    (cat_major, 'Kiến trúc', true), (cat_major, 'Sư phạm', true)
    ON CONFLICT (category_id, name) DO NOTHING;

    -- Topics
    INSERT INTO tags (category_id, name, is_system) VALUES
    (cat_topics, 'AI', true), (cat_topics, 'Data', true),
    (cat_topics, 'Product', true), (cat_topics, 'UI/UX', true),
    (cat_topics, 'Startup', true), (cat_topics, 'Branding', true),
    (cat_topics, 'Marketing số', true), (cat_topics, 'Tài chính cá nhân', true),
    (cat_topics, 'Du học', true), (cat_topics, 'Học bổng', true),
    (cat_topics, 'Tâm lý học', true), (cat_topics, 'Năng suất cá nhân', true),
    (cat_topics, 'Sức khỏe tinh thần', true), (cat_topics, 'Giáo dục', true),
    (cat_topics, 'Sustainability', true)
    ON CONFLICT (category_id, name) DO NOTHING;

    -- Gaming
    INSERT INTO tags (category_id, name, is_system) VALUES
    (cat_gaming, 'Liên Minh Huyền Thoại', true), (cat_gaming, 'Valorant', true),
    (cat_gaming, 'FC Online', true), (cat_gaming, 'PUBG Mobile', true),
    (cat_gaming, 'Minecraft', true), (cat_gaming, 'Genshin Impact', true),
    (cat_gaming, 'Liên Quân Mobile', true), (cat_gaming, 'Game co-op', true),
    (cat_gaming, 'Game chiến thuật', true), (cat_gaming, 'Game sinh tồn', true)
    ON CONFLICT (category_id, name) DO NOTHING;

END $$;
