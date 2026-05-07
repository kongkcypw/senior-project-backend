import { stripMentions } from './message-event.handler';

// The exact display name LINE embeds in message text when the bot is mentioned.
// LINE prepends '@' then the bot's display name, so the full mention tag is:
// "@Khunphan - ขุนพันธ์"  (20 characters in UTF-16 code units)
const BOT_MENTION = '@Khunphan - ขุนพันธ์';
const BOT_MENTION_LEN = BOT_MENTION.length; // 20

describe('stripMentions', () => {

    // ── Real-world group-chat messages ────────────────────────────────────────

    it('real: "@Khunphan - ขุนพันธ์ ประวัติการออกกำลังกายครั้งล่าสุด" → LastWorkoutSession query', () => {
        const text = `${BOT_MENTION} ประวัติการออกกำลังกายครั้งล่าสุด`;
        const result = stripMentions(text, [{ index: 0, length: BOT_MENTION_LEN }]);
        expect(result.trim()).toBe('ประวัติการออกกำลังกายครั้งล่าสุด');
    });

    it('real: "@Khunphan - ขุนพันธ์ โปรแกรมออกกำลังกาย" → WorkoutProgram query', () => {
        const text = `${BOT_MENTION} โปรแกรมออกกำลังกาย`;
        const result = stripMentions(text, [{ index: 0, length: BOT_MENTION_LEN }]);
        expect(result.trim()).toBe('โปรแกรมออกกำลังกาย');
    });

    it('real: "แผนโภชนาการ @Khunphan - ขุนพันธ์" → NutritionPlan query (mention at end)', () => {
        const prefix = 'แผนโภชนาการ ';
        const text = `${prefix}${BOT_MENTION}`;
        // prefix is 12 chars ("แผนโภชนาการ" = 11 Thai chars + 1 space)
        const result = stripMentions(text, [{ index: prefix.length, length: BOT_MENTION_LEN }]);
        expect(result.trim()).toBe('แผนโภชนาการ');
    });

    // ── Positional edge cases ─────────────────────────────────────────────────

    it('mention at the very start of text', () => {
        const text = `${BOT_MENTION} สวัสดี`;
        const result = stripMentions(text, [{ index: 0, length: BOT_MENTION_LEN }]);
        expect(result.trim()).toBe('สวัสดี');
    });

    it('mention at the very end of text', () => {
        const prefix = 'สวัสดี ';
        const text = `${prefix}${BOT_MENTION}`;
        const result = stripMentions(text, [{ index: prefix.length, length: BOT_MENTION_LEN }]);
        expect(result.trim()).toBe('สวัสดี');
    });

    it('mention sandwiched between words', () => {
        const prefix = 'เฮ้ ';
        const suffix = ' ช่วยด้วย';
        const text = `${prefix}${BOT_MENTION}${suffix}`;
        const result = stripMentions(text, [{ index: prefix.length, length: BOT_MENTION_LEN }]);
        expect(result.trim()).toBe('เฮ้  ช่วยด้วย'.trim());
    });

    // ── Multiple-mention cases ────────────────────────────────────────────────

    it('two bot mentions — removes both without index offset corruption', () => {
        // "@Khunphan - ขุนพันธ์ สวัสดี @Khunphan - ขุนพันธ์ ครับ"
        // second mention starts after first mention + " สวัสดี " (8 chars)
        const middle = ' สวัสดี ';
        const text = `${BOT_MENTION}${middle}${BOT_MENTION} ครับ`;
        const secondIndex = BOT_MENTION_LEN + middle.length;
        const result = stripMentions(text, [
            { index: 0, length: BOT_MENTION_LEN },
            { index: secondIndex, length: BOT_MENTION_LEN },
        ]);
        expect(result.trim()).toBe('สวัสดี  ครับ'.trim());
    });

    it('two mentions provided in ascending index order — still strips correctly', () => {
        const middle = ' สวัสดี ';
        const text = `${BOT_MENTION}${middle}${BOT_MENTION} ครับ`;
        const secondIndex = BOT_MENTION_LEN + middle.length;
        // pass in ascending order (index 0 first) — function must sort descending internally
        const result = stripMentions(text, [
            { index: secondIndex, length: BOT_MENTION_LEN },
            { index: 0, length: BOT_MENTION_LEN },
        ]);
        expect(result.trim()).toBe('สวัสดี  ครับ'.trim());
    });

    // ── Empty / no-op cases ───────────────────────────────────────────────────

    it('text is only the bot mention (no query) → empty string', () => {
        const result = stripMentions(BOT_MENTION, [{ index: 0, length: BOT_MENTION_LEN }]);
        expect(result.trim()).toBe('');
    });

    it('empty mentionees list → text returned unchanged', () => {
        const text = 'สวัสดีครับ';
        expect(stripMentions(text, [])).toBe('สวัสดีครับ');
    });

    // ── Immutability ──────────────────────────────────────────────────────────

    it('does not mutate the original mentionees array', () => {
        const text = `${BOT_MENTION} สวัสดี`;
        const mentionees = [{ index: 0, length: BOT_MENTION_LEN }];
        const snapshot = [...mentionees];
        stripMentions(text, mentionees);
        expect(mentionees).toEqual(snapshot);
    });
});
