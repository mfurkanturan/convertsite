import os

SCRIPT_FONTS = [
    ((0x0530, 0x058F), "/usr/share/fonts/truetype/noto/NotoSansArmenian-Regular.ttf"),
    ((0x0590, 0x05FF), "/usr/share/fonts/truetype/noto/NotoSansHebrew-Regular.ttf"),
    ((0x0600, 0x077F), "/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf"),
    ((0x0900, 0x097F), "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf"),
    ((0x0980, 0x09FF), "/usr/share/fonts/truetype/noto/NotoSansBengali-Regular.ttf"),
    ((0x0A00, 0x0A7F), "/usr/share/fonts/truetype/noto/NotoSansGurmukhi-Regular.ttf"),
    ((0x0A80, 0x0AFF), "/usr/share/fonts/truetype/noto/NotoSansGujarati-Regular.ttf"),
    ((0x0B00, 0x0B7F), "/usr/share/fonts/truetype/noto/NotoSansOriya-Regular.ttf"),
    ((0x0B80, 0x0BFF), "/usr/share/fonts/truetype/noto/NotoSansTamil-Regular.ttf"),
    ((0x0C00, 0x0C7F), "/usr/share/fonts/truetype/noto/NotoSansTelugu-Regular.ttf"),
    ((0x0C80, 0x0CFF), "/usr/share/fonts/truetype/noto/NotoSansKannada-Regular.ttf"),
    ((0x0D00, 0x0D7F), "/usr/share/fonts/truetype/noto/NotoSansMalayalam-Regular.ttf"),
    ((0x0D80, 0x0DFF), "/usr/share/fonts/truetype/noto/NotoSansSinhala-Regular.ttf"),
    ((0x0E00, 0x0E7F), "/usr/share/fonts/truetype/noto/NotoSansThai-Regular.ttf"),
    ((0x0E80, 0x0EFF), "/usr/share/fonts/truetype/noto/NotoSansLao-Regular.ttf"),
    ((0x0F00, 0x0FFF), "/usr/share/fonts/truetype/noto/NotoSansTibetan-Regular.ttf"),
    ((0x1000, 0x109F), "/usr/share/fonts/truetype/noto/NotoSansMyanmar-Regular.ttf"),
    ((0x10A0, 0x10FF), "/usr/share/fonts/truetype/noto/NotoSansGeorgian-Regular.ttf"),
    ((0x1200, 0x137F), "/usr/share/fonts/truetype/noto/NotoSansEthiopic-Regular.ttf"),
    ((0x13A0, 0x13FF), "/usr/share/fonts/truetype/noto/NotoSansCherokee-Regular.ttf"),
    ((0x16A0, 0x16FF), "/usr/share/fonts/truetype/noto/NotoSansCanadianAboriginal-Regular.ttf"),
    ((0x1780, 0x17FF), "/usr/share/fonts/truetype/noto/NotoSansKhmer-Regular.ttf"),
    ((0x4E00, 0x9FFF), "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"),
]


def font_for_text(text):
    for character in text:
        codepoint = ord(character)
        for (first, last), path in SCRIPT_FONTS:
            if first <= codepoint <= last and os.path.isfile(path):
                return path
    return None
