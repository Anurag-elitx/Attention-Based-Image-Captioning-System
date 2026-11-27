import base64
import json
import mimetypes
import re
from typing import Any, Dict, List, Optional, Tuple
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
    (
        ("dark", "night", "crowd", "party", "club", "concert", "stage", "lights", "neon", "bar"),
        {
            "title": "Electric Nights & Neon Lights",
            "emojis": "🪩✨🔥",
            "hashtags": "#Nightlife #AfterHours #ElectricVibes #GoodEnergy #WeekendMood",
            "ig": "Lost in the music, lit by neon, and surrounded by the best energy. Nights like this never get old.",
            "tt": "POV: The beat drops and nobody is checking their phone. Drop a 🔥 if you needed a night like this!",
            "fb": "There's nothing like a packed room, good music, and unforgettable energy. Who are you bringing next weekend?",
            "x": "late nights, loud music, zero regrets.",
            "th": "some nights just hit different when the lights go down.",
            "wa": "You should have been here tonight—the energy is unreal!",
            "sn": "After hours energy!",
            "li": "Shared experiences and high-energy moments remind us why community matters outside the daily grind.",
        },
    ),
    (
        ("city", "street", "building", "urban", "skyline", "bridge", "car", "road", "traffic"),
        {
            "title": "City Pulse in Motion",
            "emojis": "🏙️✨",
            "hashtags": "#CityVibes #UrbanExploration #StreetStyle #Cityscape #Wanderlust",
            "ig": "Every corner has a story if you slow down long enough to catch the light.",
            "tt": "POV: Main character walk through the city at golden hour. Which city is this giving?",
            "fb": "There is something timeless about city streets in motion. What's your favorite city to explore on foot?",
            "x": "concrete, skyline, and nowhere I'd rather wander.",
            "th": "city energy hits different when you take the scenic route.",
            "wa": "Out exploring the city today—had to send this view!",
            "sn": "City mode activated!",
            "li": "Big cities are built on ambition, movement, and ideas colliding in real time.",
        },
    ),
    (
        ("sunset", "sunrise", "sky", "cloud", "forest", "tree", "park", "flower", "nature", "lake", "river"),
        {
            "title": "Golden Light & Stillness",
            "emojis": "🌅🌿✨",
            "hashtags": "#NatureLovers #GoldenHour #ChasingLight #Outdoors #PeacefulVibes",
            "ig": "When the sky puts on a show like this, everything else can wait.",
            "tt": "POV: Nature casually reminding you to put the phone down and breathe. Rate this view 1-10!",
            "fb": "Moments outdoors have a way of resetting everything. Where do you go to unwind?",
            "x": "no filter needed when the light does all the work.",
            "th": "stepping outside for ten minutes fixes more than we admit.",
            "wa": "Look at this view right now—needed to share this!",
            "sn": "Nature therapy!",
            "li": "Stepping outside to reset perspective is one of the highest-ROI habits in any week.",
        },
    ),
    (
        ("smile", "smiling", "portrait", "selfie", "friends", "group", "people", "standing", "sitting", "couple"),
        {
            "title": "Good Company, Great Energy",
            "emojis": "✨🥂",
            "hashtags": "#GoodVibes #CoreMemories #WithMyPeople #MomentsThatMatter",
            "ig": "Surrounded by the right people, even an ordinary day turns into a core memory.",
            "tt": "POV: You're with the people who make every plan 10x funnier. Tag your crew!",
            "fb": "Life is better when you share the moment with great company. Tag someone you're grateful for today!",
            "x": "good people, good energy, zero complaints.",
            "th": "the best moments are never the ones you overplan.",
            "wa": "Best crew, best day!",
            "sn": "Vibes on point right now!",
            "li": "Great teams and great friendships share the same foundation: trust, energy, and showing up.",
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

        title = _build_generic_title(base_caption)
        t = tone.lower()
        is_playful = t in ("witty", "humorous", "playful", "sarcastic")
        if length == "Short":
            return title, {
                "instagram": "Unfiltered energy, captured at the exact right second. ✨ #Moments #DailyVibes #Captured",
                "tiktok": "POV: When the vibe is too good not to post. ✨ #Vibes #FYP",
                "facebook": "Some moments are too good to keep in the camera roll.",
                "twitter": "no caption needed—just pure energy." if is_playful else "some moments speak for themselves.",
                "threads": "honestly, this kind of energy hits different today.",
                "whatsapp": "Had to share this moment with you ✨",
                "snapchat": "Right now energy 🔥",
                "linkedin": "Staying present and noticing the details that make the journey worthwhile. #Perspective",
            }
        return title, {
            "instagram": (
                "Main character energy—some frames just capture the mood better than words ever could. ✨ #Moments #DailyVibes #Captured"
                if is_playful
                else "Caught in the moment, holding onto the energy long after it passed. ✨ #Moments #DailyVibes #Captured"
            ),
            "tiktok": "POV: You almost didn't take the photo, and now it's your favorite one. Drop a 🔥 if you feel this! #Vibes #FYP",
            "facebook": "Some frames deserve a permanent spot on the feed—what's the story behind your favorite photo this week?",
            "twitter": "living for moments that don't need a long explanation." if is_playful else "some moments speak louder than any caption.",
            "threads": "honestly, moments like this hit different when you're actually present for them.",
            "whatsapp": "Look at this shot—had to send it right away ✨",
            "snapchat": "Mood of the moment! 🔥",
            "linkedin": "The best moments remind us to pause, observe, and bring full presence to what's in front of us. #Perspective #Mindset",
        }

    @classmethod
    def adapt(
        cls,
        base_caption: str,
        language: str = "English (US)",
        tone: str = "Default",
        length: str = "Default",
        image_path: Optional[str] = None,
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

        parts: List[Dict[str, Any]] = [{"text": prompt}]
        if image_path:
            try:
                with open(image_path, "rb") as img_file:
                    raw_bytes = img_file.read()
                if len(raw_bytes) <= 4 * 1024 * 1024:
                    mime, _ = mimetypes.guess_type(image_path)
                    parts.append({
                        "inline_data": {
                            "mime_type": mime or "image/jpeg",
                            "data": base64.b64encode(raw_bytes).decode("ascii"),
                        }
                    })
            except OSError:
                pass

        payload = {
            "contents": [{"role": "user", "parts": parts}],
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
