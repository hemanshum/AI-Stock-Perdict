import OpenAI from "openai";
import { useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { dates } from "../utils/dates";

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export default function StockPredict() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiRes, setAiRes] = useState("");
  const [headLine, setHeadline] = useState("");
  const [input, setInput] = useState("");
  const [stockList, setStockList] = useState([]);

  function handleSubmit() {
    setStockList((pre) => [...pre, input]);
    setInput("");
  }

  async function fetchStockData() {
    setIsLoading(true);
    try {
      const stockData = await Promise.all(
        stockList.map(async (stock) => {
          const url = `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.EXPO_PUBLIC_POLYGON_API_KEY}`;
          const response = await fetch(url);
          const data = await response.text();
          const status = await response.status;
          if (status === 200) {
            return data;
          }
        }),
      );
      fetchReport(stockData.join(""));
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchReport(data) {
    setHeadline(`Stock Report for ${stockList}`);
    setStockList([]);
    const messages = [
      {
        role: "system",
        content:
          "You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided between ### to set the style of your response.",
      },
      {
        role: "user",
        content: `${data}
        ###
        OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
        ###
        ###
        Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
        ###    
        `,
      },
    ];

    try {
      const res = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 1.1,
        // max_tokens: 100
      });
      setAiRes(res.choices[0].message.content);
      setIsLoading(false);
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <View style={{ borderWidth: 0.5, borderRadius: 8, padding: 16 }}>
      <Text style={styles.title}>StockPredict </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingBottom: 16,
        }}
      >
        <TextInput
          style={{ borderWidth: 1, width: 150 }}
          placeholder="Enter Stock Name"
          value={input}
          onChangeText={setInput}
        />
        <Button title="+" style={{ padding: 16 }} onPress={handleSubmit} />
      </View>
      <Text style={{ fontSize: 16 }}>{stockList.join(", ")}</Text>
      <Pressable
        style={{ padding: 16, backgroundColor: "#1DCA8E", borderRadius: 6 }}
        onPress={fetchStockData}
      >
        <Text style={{ textAlign: "center" }}>Get Response</Text>
      </Pressable>
      {isLoading && (
        <Text style={{ fontSize: 16, textAlign: "center", marginTop: 14 }}>
          Generating Report...
        </Text>
      )}
      {aiRes.length > 0 && (
        <Text style={{ marginTop: 16, lineHeight: 20, fontSize: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{headLine}</Text>{" "}
          {"\n"}
          {"\n"}
          {aiRes}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
