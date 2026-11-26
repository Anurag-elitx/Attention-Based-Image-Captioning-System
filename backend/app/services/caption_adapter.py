import json
import re
from typing import Any, Dict, List, Tuple
import httpx
from app.config import settings

NETWORK_KEYS = [
    "instagram",
    "tiktok",
    "facebook",
    "twitter",
    "threads",
    "whatsapp",
    "snapchat",
    "linkedin",
]

TOPIC_PRESETS: List[Tuple[Tuple[str, ...], Dict[str, Any]]] = [
    (
        ("ski", "snow", "mountain", "slope", "snowboard"),
        {
            "title": "Conquer the Mountain's Majesty",
            "emojis": "❄️🏔️",
            "hashtags": "#SkiLife #WinterWonderland #MountainAdventure #PowderDay #SkiingIsLife",
            "ig": "Carving through fresh powder with breathtaking mountain views. The ultimate thrill of the descent!",
            "tt": "POV: You're shredding down the steepest slopes with epic views. Drop a 🔥 if you're hitting the powder this season!",
            "fb": "There's nothing quite like the feeling of fresh powder and a clear blue sky. What's your favorite ski destination? Share your stories below!",
            "x": "Embracing the exhilaration of the mountain. Pure bliss in every turn.",
            "th": "Chasing powder and epic views. This is what winter dreams are made of.",
            "wa": "Just had an epic ski run! The snow is amazing.",
            "sn": "Living my best ski life!",
            "li": "Mastering the slopes requires precision, skill, and a passion for the challenge. Embracing the journey of continuous improvement.",
        },
    ),
    (
        ("dog", "puppy", "pup"),
        {
            "title": "Pure Joy in Motion",
            "emojis": "🐶🐾",
            "hashtags": "#DogLife #GoodBoy #DogsOfInstagram #Pawsome #DailyJoy",
            "ig": "Unfiltered happiness and tail wags. Nothing beats a day out with this one.",
            "tt": "POV: Peak happiness looks a lot like this. Drop a 😍 if this made your day!",
            "fb": "How could anyone not smile looking at this face? Share your favorite pet photo in the comments!",
            "x": "Living its absolute best life today. Zero complaints.",
            "th": "That feeling when the day hits just right.",
            "wa": "Look at this happy face! Made my whole day.",
            "sn": "Best vibes only right now!",
            "li": "Taking a moment to recharge and appreciate simple joys. Balance fuels better work.",
        },
    ),
    (
        ("cat", "kitten"),
        {
            "title": "Unbothered Feline Royalty",
            "emojis": "🐱✨",
            "hashtags": "#CatLife #CatsOfInstagram #FelineVibes #CatLovers",
            "ig": "Main character energy, zero apologies. Just living in their world.",
            "tt": "POV: You're being silently judged and still obsessed.",
            "fb": "Is anyone else's cat this expressive? Tell me your cat's funniest habit below!",
            "x": "unbothered. moisturized. in their lane.",
            "th": "honestly, cats run the house and we just pay rent.",
            "wa": "Caught this iconic expression today 😂",
            "sn": "Cat mood of the day!",
            "li": "Quiet confidence and laser focus—lessons from an unexpected mentor.",
        },
    ),
    (
        ("beach", "ocean", "wave", "surf", "water", "sea"),
        {
            "title": "Chasing Saltwater Horizons",
            "emojis": "🌊☀️",
            "hashtags": "#OceanVibes #GoldenHour #SaltwaterTherapy #CoastalLiving",
            "ig": "Salt air, open horizons, and nowhere else I'd rather be.",
            "tt": "POV: You traded deadlines for ocean waves. Would you stay here?",
            "fb": "Nothing resets the mind faster than the sound of waves. Where's your favorite coastal escape?",
            "x": "salt air fixes almost everything.",
            "th": "ocean breeze hitting different today.",
            "wa": "Wish you were here—the water is unreal today!",
            "sn": "Ocean therapy in session!",
            "li": "Stepping away to reconnect with nature brings fresh clarity and creative energy.",
        },
    ),
    (
        ("food", "pizza", "burger", "ramen", "plate", "dinner", "cake", "coffee"),
        {
            "title": "Crafted for the Craving",
            "emojis": "😋🔥",
            "hashtags": "#Foodstagram #EatGood #ComfortFood #FoodieFinds",
            "ig": "Every bite worth the hype. Saving this spot for next weekend too.",
            "tt": "POV: You found your new favorite obsession. Tag someone who owes you dinner!",
            "fb": "Okay, be honest—what's your go-to comfort meal after a long week?",
            "x": "currently in a committed relationship with this plate.",
            "th": "good food fixes 90% of bad days.",
            "wa": "We HAVE to go here next time we hang out!",
            "sn": "Food goals unlocked!",
            "li": "Great meals and intentional breaks are underrated fuel for sustained focus.",
        },
    ),
]


def _build_generic_title(base_caption: str) -> str:
    stop = {"a", "an", "the", "with", "in", "on", "at", "of", "and", "is", "are", "down", "next", "to"}
    words = [w for w in re.findall(r"[A-Za-z0-9']+", base_caption) if w.lower() not in stop]
    picked = words[:4] if words else ["Captured", "Moment"]
    return " ".join(w.capitalize() for w in picked)


def _humanize_scene(base_caption: str) -> str:
    text = base_caption.strip().rstrip(".")
    text = re.sub(r"^(?:a|an)\s+(?:person|man|woman|boy|girl)\s+", "", text, flags=re.IGNORECASE)
    text = re.sub(r"^(?:a|an)\s+", "", text, flags=re.IGNORECASE)
    return text


class CaptionAdapterService:
    """Option A adapter: turns the Attention-LSTM base caption into title + 8 platform captions."""

    @staticmethod
    def _fallback_result(
        base_caption: str,
        tone: str = "Default",
        length: str = "Default",
    ) -> Tuple[str, Dict[str, str]]:
        lower = base_caption.lower()
        for keywords, preset in TOPIC_PRESETS:
            if any(re.search(rf"\b{kw}", lower) for kw in keywords):
                emojis = preset["emojis"]
                tags = preset["hashtags"]
                short_tags = " ".join(tags.split()[:2])
                if length == "Short":
                    captions = {
                        "instagram": f"{preset['x']} {emojis} {short_tags}",
                        "tiktok": f"{preset['tt'].split('!')[0]}! {emojis}",
                        "facebook": preset["x"],
                        "twitter": preset["x"],
                        "threads": preset["th"],
                        "whatsapp": preset["wa"],
                        "snapchat": f"{preset['sn']} {emojis}",
                        "linkedin": preset["li"],
                    }
                else:
                    captions = {
                        "instagram": f"{preset['ig']} {tags}",
                        "tiktok": f"{preset['tt']} {short_tags}",
                        "facebook": preset["fb"],
                        "twitter": f"{preset['x']} {short_tags}",
                        "threads": f"{preset['th']} {tags.split()[0]}",
                        "whatsapp": preset["wa"],
                        "snapchat": f"{preset['sn']} {emojis}",
                        "linkedin": f"{preset['li']} #Leadership #Growth",
                    }
                return preset["title"], captions

        scene = _humanize_scene(base_caption)
        title = _build_generic_title(base_caption)
        t = tone.lower()
        hook = (
            f"Main character moment: {scene}."
            if t in ("witty", "humorous", "playful", "sarcastic")
            else f"Capturing the energy of {scene}."
        )
        return title, {
            "instagram": f"{hook} ✨ #Moments #DailyVibes #Captured",
            "tiktok": f"POV: {scene} ✨ #Vibes #FYP",
            "facebook": f"{hook} What does this remind you of?",
            "twitter": f"{scene} — some moments speak for themselves.",
            "threads": f"honestly, {scene} hits different today.",
            "whatsapp": f"Look at this: {scene} ✨",
            "snapchat": f"Right now: {scene} 🔥",
            "linkedin": f"Moments like {scene} remind us to pause, observe, and stay present. #Perspective",
        }

    @classmethod
    def adapt(
        cls,
        base_caption: str,
        language: str = "English (US)",
        tone: str = "Default",
        length: str = "Default",
    ) -> Tuple[str, Dict[str, str]]:
        api_key = (settings.GEMINI_API_KEY or "").strip()
        if not api_key:
            return cls._fallback_result(base_caption, tone=tone, length=length)

        length_hint = {
            "Short": "very short and punchy (1 concise sentence max)",
            "Medium": "balanced medium length (1-2 sentences)",
            "Long": "richer, descriptive length (2-3 sentences)",
        }.get(length, "natural platform-native length")

        tone_hint = (
            "natural, authentic, and platform-native"
            if tone == "Default"
            else f"{tone.lower()} tone"
        )

        prompt = (
            "You are a top social-media copywriter. NEVER write a dry literal photo description.\n"
            f'Visual scene detected by vision model: "{base_caption}"\n'
            f"Target language: {language}\n"
            f"Tone: {tone_hint}\n"
            f"Length: {length_hint}\n\n"
            "Create a punchy 3-5 word editorial title (like \"Conquer the Mountain's Majesty\") "
            "AND 8 scroll-stopping social media captions in this exact JSON schema:\n"
            '{"title": "...", "instagram": "...", "tiktok": "...", "facebook": "...", '
            '"twitter": "...", "threads": "...", "whatsapp": "...", "snapchat": "...", "linkedin": "..."}\n'
            "Rules:\n"
            "- Write every caption natively in the target language.\n"
            "- Do NOT repeat 'a person...' or 'a photo of...'.\n"
            "- Return ONLY valid JSON with those 9 string keys."
        )

        if api_key.startswith("AQ."):
            url = (
                f"https://aiplatform.googleapis.com/v1/publishers/google/models/"
                f"{settings.GEMINI_MODEL}:generateContent"
            )
        else:
            url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/"
                f"{settings.GEMINI_MODEL}:generateContent"
            )

        payload = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.75,
            },
        }

        try:
            with httpx.Client(timeout=20.0) as client:
                resp = client.post(url, params={"key": api_key}, json=payload)
                resp.raise_for_status()
                data = resp.json()

            text = (
                data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "")
            ).strip()
            if text.startswith("```"):
                text = text.strip("`")
                if text.lower().startswith("json"):
                    text = text[4:].strip()
            parsed = json.loads(text)
            fb_title, fb_captions = cls._fallback_result(base_caption, tone=tone, length=length)
            title = str(parsed.get("title") or fb_title).strip()
            captions = {
                key: str(parsed.get(key) or fb_captions[key]).strip()
                for key in NETWORK_KEYS
            }
            return title, captions
        except Exception as exc:
            print(f"Gemini adapter fallback triggered: {exc}")
            return cls._fallback_result(base_caption, tone=tone, length=length)
