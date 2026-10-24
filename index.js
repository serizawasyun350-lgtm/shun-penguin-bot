import { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits
} from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`[しゅん＆ぺんぎんさばBot] ログイン完了: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  // 1. スラッシュコマンド処理
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;

    // 98番目: チケットパネル
    if (commandName === 'ticket-panel') {
      const embed = new EmbedBuilder()
        .setTitle('🎫 お問い合わせ・サポート')
        .setDescription('下のボタンを押すと、運営スタッフ専用の個別チケットチャンネルを作成します。')
        .setColor(0x00AE8D);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('create_ticket')
          .setLabel('チケットを発行')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🎫')
      );

      await interaction.reply({ embeds: [embed], components: [row] });
      return;
    }

    // 99番目: 認証パネル（ロール選択オプション付き）
    if (commandName === 'verify-panel') {
      const targetRole = interaction.options.getRole('role');

      const embed = new EmbedBuilder()
        .setTitle('✅ 認証パネル')
        .setDescription('下のボタンを押してサーバー認証を完了してください。')
        .setColor(0x5865F2);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`btn_verify_${targetRole.id}`) // ロールIDをボタンIDに埋め込み
          .setLabel('認証する')
          .setStyle(ButtonStyle.Success)
          .setEmoji('🔓')
      );

      await interaction.reply({ embeds: [embed], components: [row] });
      return;
    }

    // その他のコマンド処理
    switch (commandName) {
      case 'shun':
        await interaction.reply('しゅん＆ぺんぎんさばへようこそ！🐧✨');
        break;
      case 'ping':
        await interaction.reply(`Pong! 🏓 応答速度: ${client.ws.ping}ms`);
        break;
      case 'verify':
        await interaction.reply({ content: '手動認証が実行されました。', ephemeral: true });
        break;
      case 'omikuji':
        const results = ['大吉 🎉', '中吉 ✨', '小吉 🌱', '吉 🍀', '凶 💧'];
        const randomResult = results[Math.floor(Math.random() * results.length)];
        await interaction.reply(`今日の運勢は... **${randomResult}** です！`);
        break;
      case 'coinflip':
        const coin = Math.random() < 0.5 ? '表 (Heads)' : '裏 (Tails)';
        await interaction.reply(`コインの結果は... **${coin}** です！🪙`);
        break;
      default:
        await interaction.reply({ content: `コマンド「/${commandName}」を実行しました。`, ephemeral: true });
        break;
    }
  }

  // 2. ボタン処理 (認証 & ロール付与・チケット)
  if (interaction.isButton()) {
    // 認証ボタンが押されたとき (埋め込んだロールIDを取り出して付与)
    if (interaction.customId.startsWith('btn_verify_')) {
      const roleId = interaction.customId.replace('btn_verify_', '');
      const role = interaction.guild.roles.cache.get(roleId);

      if (!role) {
        await interaction.reply({ content: '❌ 指定された認証ロールが見つかりませんでした。運営にお問い合わせください。', ephemeral: true });
        return;
      }

      try {
        await interaction.member.roles.add(role);
        await interaction.reply({ content: `✅ 認証が完了しました！ **${role.name}** ロールを付与しました。しゅん＆ぺんぎんさばをお楽しみください！✨`, ephemeral: true });
      } catch (error) {
        console.error('ロール付与エラー:', error);
        await interaction.reply({ content: '❌ ロールの付与に失敗しました。Botの権限（ロール順序）を確認してください。', ephemeral: true });
      }
    }

    // チケット発行ボタンが押されたとき
    if (interaction.customId === 'create_ticket') {
      const channelName = `ticket-${interaction.user.username}`;
      const guild = interaction.guild;

      const ticketChannel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
          },
        ],
      });

      await interaction.reply({ content: `チケットチャンネルを作成しました: ${ticketChannel}`, ephemeral: true });
      await ticketChannel.send(`@here ${interaction.user} 様、お問い合わせありがとうございます。運営の対応をお待ちください！`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
