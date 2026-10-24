import unittest
from types import SimpleNamespace
from evaluate import accuracy, normalized, edit_distance, ordered_word_matches, upright_word
from scenarios import cases, TOOLS


class AuditIntegrity(unittest.TestCase):
    def test_unicode_and_whitespace_normalization(self):
        self.assertEqual(normalized('I\u0307stanbul  12\n34'), normalized('İstanbul1234'))

    def test_missing_and_changed_critical_digit_reduce_accuracy(self):
        self.assertLess(accuracy('1234.56', '1234.57'), 1)
        self.assertEqual(accuracy('ABC', ''), 0)
        self.assertEqual(accuracy('ABC', 'ABC'), 1)

    def test_every_tool_has_eight_distinct_scenarios(self):
        suite = cases()
        self.assertEqual(len(suite), 120)
        self.assertEqual(len({c['id'] for c in suite}), 120)
        for tool in TOOLS:
            self.assertEqual(sum(c['tool'] == tool for c in suite), 8)

    def test_word_errors_count_insertions_deletions_and_substitutions(self):
        self.assertEqual(edit_distance(['hello','world'],['hello','word']),1)
        self.assertEqual(edit_distance(['hello'],['hello','world']),1)
        self.assertEqual(edit_distance(['hello','world'],['hello']),1)

    def test_repeated_word_positions_are_matched_in_order(self):
        expected=[
            {'text':'same','x0':0,'top':0},
            {'text':'same','x0':0,'top':100},
        ]
        actual=[
            {'text':'same','x0':0,'top':95},
            {'text':'same','x0':0,'top':5},
        ]
        matches=ordered_word_matches(expected,actual)
        self.assertEqual(matches,[(expected[0],actual[0]),(expected[1],actual[1])])
        self.assertEqual(max(abs(a['top']-e['top']) for e,a in matches),95)

    def test_unicode_equivalent_words_match_in_order(self):
        expected=[{'text':'I\u0307stanbul','x0':0,'top':0}]
        actual=[{'text':'İstanbul','x0':1,'top':2}]
        self.assertEqual(ordered_word_matches(expected,actual),[(expected[0],actual[0])])

    def test_rotated_pdf_word_bounds_are_mapped_to_upright_coordinates(self):
        page=SimpleNamespace(width=595,height=842,rotation=90)
        word={'text':'İstanbul','x0':497.117,'x1':509.117,'top':40,'bottom':88.012}
        upright=upright_word(word,page)
        self.assertAlmostEqual(upright['x0'],40)
        self.assertAlmostEqual(upright['x1'],88.012)
        self.assertAlmostEqual(upright['top'],85.883)
        self.assertAlmostEqual(upright['bottom'],97.883)


if __name__ == '__main__': unittest.main()
