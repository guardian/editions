import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Product } from 'react-native-iap';
import RNIAP from 'react-native-iap';
import { Button } from 'src/components/Button/Button';
import { HeaderScreenContainer } from 'src/components/Header/Header';

const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
});

export const InAppPurchaseScreen = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [receipt, setReceipt] = useState('');

	useEffect(() => {
		RNIAP.getProducts({
			skus: ['uk.co.guardian.gce.sevenday.1monthsub2'],
		}).then((p) => setProducts(p));

		const purchaseSubscription = RNIAP.purchaseUpdatedListener(
			(purchase: any) => {
				const receipt = purchase.transactionReceipt;
				if (receipt) {
					RNIAP.finishTransaction(purchase);
					setReceipt(receipt);
				}
			},
		);

		return () => {
			purchaseSubscription.remove();
		};
	}, []);

	return (
		<HeaderScreenContainer title="In App Purchase" actionLeft={true}>
			<View style={styles.container}>
				{products.length > 0 ? (
					products.map(
						({ description, localizedPrice, productId, title }) => (
							<View key={productId}>
								<Text>{productId}</Text>
								<Text>{title}</Text>
								<Text>{description}</Text>
								<Text>{localizedPrice}</Text>
								<Button
									onPress={() =>
										RNIAP.requestSubscription({
											sku: productId,
										})
									}
								>
									Subscribe
								</Button>
							</View>
						),
					)
				) : (
					<Text>Loading...</Text>
				)}
			</View>
			<Text>{receipt}</Text>
		</HeaderScreenContainer>
	);
};
