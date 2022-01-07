module.exports = {
    content: {
        "general": {
            userNotInVoiceChannel: {
                "en-GB": "You must be in a voice channel to use this command.",
                "fr-FR": "Vous devez être dans un salon vocal pour utiliser cette commande.",
                "de-DE": "Du musst in einem Sprachkanal sein um diesen Befehl zu nutzen.",
                "ar-SA": "يجب أن تكون في روم صوتي لاستخدام هذا الأمر.",
                "en-shooken": "Wendy says that you need to be in a voice channel to use this command!! 𓆏"
            },
            notPlayingAudio: {
                "en-GB": "I'm playing any audio in a voice channel.",
                "fr-FR": "Je ne joue actuellement aucune musique dans un salon vocal.",
                "de-DE": "Ich spiele momentan keine Musik in einem Sprachkanal.",
                "ar-SA": "لا أصدق أصوات صوتية في روم صوتي حاليا.",
                "en-shooken": "wendy says that she isn't playing any audio in a voice channel right now. 𓆏"
            },
            userNotInBotChannel: {
                "en-GB": "You must be in the bot's voice channel to use this command.",
                "fr-FR": "Vous devez être dans le salon vocal du bot pour utiliser cette commande.",
                "de-DE": "Du musst im Sprachkanal des Bots sein um diesen Befehl zu nutzen.",
                "ar-SA": "يجب أن تكون في روم صوتي للبوت لاستخدام هذا الأمر.",
                "en-shooken": "join my fucking voice channel. 𓆏"
            },
            noPermission: {
                "en-GB": "You do not have permission to use this command.",
                "fr-FR": "Vous n'avez pas la permission d'utiliser cette commande.",
                "de-DE": "Du hast keine Berechtigung um diesen Befehl zu nutzen.",
                "ar-SA": "ليس لديك صلاحية لاستخدام هذا الأمر.",
                "en-shooken": "no permission ratio bozo"
            },

        },
        "clearQueue": {
            error: {
                "en-GB": "An error occurred whilst attempting to clear the queue. Try again later.",
                "fr-FR": "Une erreur est survenue lors de la tentative de vider la file d'attente. Réessayez plus tard.",
                "de-DE": "Ein Fehler ist beim Versuch, die Warteschlange zu leeren, aufgetreten. Versuche es später noch einmal.",
                "ar-SA": "حدث خطأ أثناء محاولة إزالة القائمة. أعد المحاولة لاحقاً."
            },
            success: {
                "en-GB": "🗑️ Removed all songs from the queue",
                "fr-FR": "🗑️ Supprimé toutes les musiques de la file d'attente",
                "de-DE": "🗑️ Entfernt alle Songs aus der Warteschlange.",
                "ar-SA": "🗑️ أزالت كل الأغاني من القائمة",
                "en-shooken": "🗑️ wendy put everything in the trash."
            }
        },
        "disconnect": {
            error: {
                "en-GB": "An error occurred whilst attempting to disconnect the bot. Try again later.",
                "fr-FR": "Une erreur est survenue lors de la tentative de déconnecter le bot. Réessayez plus tard.",
                "de-DE": "Ein Fehler ist beim Versuch, den Bot zu trennen, aufgetreten. Versuche es später noch einmal.",
                "ar-SA": "حدث خطأ أثناء محاولة إفصل البوت من الروم. أعد المحاولة لاحقاً.",
            },
            success: {
                "en-GB": "🔇 Disconnected from your voice channel",
                "fr-FR": "🔇 Déconnecté du salon vocal",
                "de-DE": "🔇 Verbindung zum Sprachkanal getrennt.",
                "ar-SA": "🔇 أفصل من رومك الصوتي",
            }
        },
        "join": {
            error: {
                "en-GB": "An error occurred whilst attempting to join the voice channel. Try again later.",
                "fr-FR": "Une erreur est survenue lors de la tentative de rejoindre le salon vocal. Réessayez plus tard.",
                "de-DE": "Ein Fehler ist beim Versuch, den Sprachkanal zu betreten, aufgetreten. Versuche es später noch einmal.",
                "ar-SA": "حدث خطأ أثناء محاولة دخول الروم الصوتي. أعد المحاولة لاحقاً.",
            },
            success: {
                "en-GB": "🎙 Connected to <!--CV-->",
                "fr-FR": "🎙 Connecté au salon vocal <!--CV-->",
                "de-DE": "🎙 Verbindung zum Sprachkanal hergestellt (<!--CV-->).",
                "ar-SA": "🎙 أنضم إلى <!--CV-->",
            }
        },
        "loop": {
            error: {
                "en-GB": "An error occurred whilst attempting to change the loop mode. Try again later.",
                "fr-FR": "Une erreur est survenue lors de la tentative de changer le mode boucle. Réessayez plus tard.",
                "de-DE": "Ein Fehler ist beim Versuch, den Loop-Modus zu ändern, aufgetreten. Versuche es später noch einmal.",
                "ar-SA": "حدث خطأ أثناء محاولة تغيير نمط الإعادة. أعد المحاولة لاحقاً.",
            },
            successSingle: {
                "en-GB": "🔁 Looping the current song",
                "fr-FR": "🔁 Boucle la musique en cours",
                "de-DE": "🔁 Wiedergabe der aktuellen Song wird in einer Endlosschleife wiederholt.",
                "ar-SA": "🔁 تكرار الأغنية الحالية",
            },
            successQueue: {
                "en-GB": "🔁 Looping the queue (current songs and new songs added to the queue)",
                "fr-FR": "🔁 Boucle la file d'attente (musiques en cours et nouvelles musiques ajoutées à la file d'attente)",
                "de-DE": "🔁 Wiedergabe der Warteschlange wird in einer Endlosschleife wiederholt (aktuelle Songs und neue Songs werden in der Warteschlange hinzugefügt).",
                "ar-SA": "🔁 تكرار القائمة (الأغاني الحالية والأغاني الجديدة التي تمت إضافتها إلى القائمة)",
            },
            successStop: {
                "en-GB": "🔁 Stopped looping, continuing with the queue",
                "fr-FR": "🔁 Arrêt de la boucle, suite à la file d'attente",
                "de-DE": "🔁 Wiedergabe der Warteschlange wird nicht mehr in einer Endlosschleife wiederholt.",
                "ar-SA": "🔁 تم إيقاف التكرار، والمتابعة مع القائمة",
            }
        },
        "nowplaying": {
            WordLive: {
                "en-GB": "Live",
                "fr-FR": "En direct",
                "de-DE": "Live",
                "ar-SA": "على الإطلاق",
            },
            WordListeningFor: {
                "en-GB": "Listening for",
                "fr-FR": "Écoute pour",
                "de-DE": "Höre zu",
                "ar-SA": "أنا أستمع ل",
            },
            AuthorTitle: {
                "en-GB": "Currently playing audio",
                "fr-FR": "Musique en cours",
                "de-DE": "Aktuell wird gespielt",
                "ar-SA": "الأغنية الحالية",
            },
            error: {
                "en-GB-old": "Oops! Songfish fell into a snag. Songfish can't read metadata about certain audio due to copyright or an illegal character being present. Apologies for the inconvenience.",
                "en-GB": "An error occurred. Try again.",
                "fr-FR": "Une erreur est survenue. Réessayez.",
                "de-DE": "Ein Fehler ist aufgetreten. Versuche es noch einmal.",
                "ar-SA": "حدث خطأ. أعد المحاولة.",
            }
        },
        "pause": {
            error: { 
                "en-GB": "An error occurred whilst attempting to pause the current song. Try again later.",
                "fr-FR": "Une erreur est survenue lors de la tentative de mettre en pause la musique en cours. Réessayez plus tard.",
                "de-DE": "Ein Fehler ist beim Versuch, den aktuellen Song zu pausieren, aufgetreten. Versuche es später noch einmal.",
                "ar-SA": "حدث خطأ أثناء محاولة إيقاف الأغنية الحالية. أعد المحاولة لاحقاً.",
            },
            success: {
                "en-GB": "⏸ Paused the current song",
                "fr-FR": "⏸ Musique en cours mis en pause",
                "de-DE": "⏸ Wiedergabe der aktuellen Song wurde pausiert.",
                "ar-SA": "⏸ تم إيقاف الأغنية الحالية",
            },
            alreadyPaused: {
                "en-GB": "The audio is already paused!",
                "fr-FR": "La musique est déjà en pause !",
                "de-DE": "Die Wiedergabe der aktuellen Song ist bereits pausiert!"
            }
        },
        "play": {

        },
        "playnext": {

        },
        "queue": {
            WordSongsLeftInQueue: {
                "en-GB": "Songs left in queue",
                "fr-FR": "Chansons restantes dans la file d'attente",
                "de-DE": "Songs in der Warteschlange",
                "ar-SA": "الأغاني المتبقية في القائمة",
            },
            WordLoopStatus: {
                "en-GB": "Loop status",
                "fr-FR": "Statut de la boucle",
                "ar-SA": "حالة التكرار",
            }
        }
    }
};