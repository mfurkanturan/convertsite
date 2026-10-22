import shutil
from openpyxl import load_workbook
from common import input_path, run, pdf_pages, EngineError


def office_to_pdf(inputs, options, directory):
    kind = inputs[0]["kind"]
    source = directory / f"input.{kind}"
    shutil.copyfile(input_path(inputs[0]), source)
    if kind == "xlsx" and options.get("sheets") == "first":
        workbook = load_workbook(source)
        if not workbook.worksheets:
            raise EngineError("INVALID_DOCUMENT")
        for index, sheet in enumerate(workbook.worksheets):
            sheet.sheet_state = "visible" if index == 0 else "hidden"
        workbook.active = 0
        workbook.save(source)
    profile = directory / "profile"
    (profile / "user").mkdir(parents=True)
    (profile / "user" / "registrymodifications.xcu").write_text('''<?xml version="1.0" encoding="UTF-8"?>
<oor:items xmlns:oor="http://openoffice.org/2001/registry">
<item oor:path="/org.openoffice.Office.Common/Security/Scripting"><prop oor:name="MacroSecurityLevel" oor:op="fuse"><value>3</value></prop></item>
</oor:items>''', encoding="utf-8")
    destination = directory / "converted"
    destination.mkdir()
    run("/usr/bin/libreoffice", [f"-env:UserInstallation={profile.as_uri()}", "--headless", "--nologo", "--nodefault",
                               "--nofirststartwizard", "--convert-to", "pdf", "--outdir", destination, source])
    output = destination / "input.pdf"
    if not output.exists():
        raise EngineError("INVALID_DOCUMENT")
    pdf_pages(output)
    return output, "pdf"
