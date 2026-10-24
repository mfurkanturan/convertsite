"""Bounded PDF table candidates for the PDF to Excel handler."""


def _nonempty_rows(table):
    extracted = table.extract()
    return [
        (row.bbox[1], values)
        for row, values in zip(table.rows, extracted)
        if values and sum(bool(value and str(value).strip()) for value in values) >= 2
    ]


def _regular_text_rows(table):
    """Keep the longest repeated-baseline run from pdfplumber's text strategy."""
    candidates = [
        (top, values)
        for top, values in _nonempty_rows(table)
        if values and all(value is not None and str(value).strip() for value in values)
    ]
    best = []
    for start in range(len(candidates)):
        run = [candidates[start]]
        step = None
        for current in candidates[start + 1:]:
            gap = current[0] - run[-1][0]
            if gap <= 0:
                continue
            if step is None:
                step = gap
            if abs(gap - step) > max(2.0, step * 0.1):
                break
            if len(current[1]) != len(run[-1][1]):
                break
            run.append(current)
        if len(run) > len(best):
            best = run
    if len(best) < 3:
        return None
    return [values for _, values in best]


def page_tables(page):
    """Return ruled tables first, then conservative text-aligned candidates."""
    ruled = page.find_tables()
    if ruled:
        return [(table.extract(), table) for table in ruled]

    settings = {
        "vertical_strategy": "text",
        "horizontal_strategy": "text",
        "min_words_vertical": 3,
    }
    results = []
    for table in page.find_tables(table_settings=settings):
        rows = _regular_text_rows(table)
        if rows:
            results.append((rows, None))
    return results


def merged_ranges(table, row_offset=0):
    """Find horizontal merged spans represented by missing pdfplumber cells."""
    if table is None:
        return []
    boundaries = sorted({
        coordinate
        for row in table.rows
        for cell in row.cells if cell is not None
        for coordinate in (cell[0], cell[2])
    })
    spans = []
    for row_index, row in enumerate(table.rows, 1):
        for cell in row.cells:
            if cell is None:
                continue
            start = min(range(len(boundaries)), key=lambda index: abs(boundaries[index] - cell[0]))
            end = min(range(len(boundaries)), key=lambda index: abs(boundaries[index] - cell[2]))
            if end - start > 1:
                spans.append((row_index + row_offset, start + 1, end))
    return spans
